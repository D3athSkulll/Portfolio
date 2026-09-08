//! Axum server: serves `profile.json`, the statically generated blog JSON, and
//! (in production) the built frontend.

use std::path::PathBuf;
use std::sync::Arc;

use axum::extract::{Path as AxPath, State};
use axum::http::StatusCode;
use axum::http::{header, HeaderValue};
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use portfolio_backend::model::Profile;
use portfolio_backend::{blog_assets_dir, content_root, gen_dir};
use serde::Deserialize;
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;
use tower_http::set_header::SetResponseHeaderLayer;
use tower_http::trace::TraceLayer;

const IMMUTABLE: HeaderValue = HeaderValue::from_static("public, max-age=31536000, immutable");

#[derive(Clone)]
struct AppState {
    root: PathBuf,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,tower_http=info".into()),
        )
        .init();

    let root = content_root();
    tracing::info!("content root: {}", root.display());

    // Fail fast if the data file is broken.
    match Profile::load(&root) {
        Ok(p) => tracing::info!("profile.json OK ({})", p.profile.name),
        Err(e) => tracing::warn!("profile.json problem: {e}"),
    }

    let state = Arc::new(AppState { root: root.clone() });

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    let mut app = Router::new()
        .route(
            "/api/health",
            get(|| async { Json(serde_json::json!({ "status": "ok" })) }),
        )
        .route("/api/profile", get(profile))
        .route("/api/blog", get(blog_index))
        .route("/api/blog/:slug", get(blog_post))
        .route("/api/contact", post(contact))
        .with_state(state)
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    // Content-hashed assets — cache for a year. Kept on its own sub-router so the
    // immutable header never leaks onto the API or index.html.
    let mut assets =
        Router::new().nest_service("/blog-assets", ServeDir::new(blog_assets_dir(&root)));

    // Serve the built SPA if it exists (production single-binary mode).
    let dist = root.join("frontend").join("dist");
    if dist.is_dir() {
        let index = dist.join("index.html");
        assets = assets.nest_service("/assets", ServeDir::new(dist.join("assets")));
        // Try a real static file first; otherwise hand the SPA its index (200, so
        // client-side routes like /projects resolve on hard refresh).
        let spa = ServeDir::new(&dist).fallback(axum::routing::get(move || {
            let index = index.clone();
            async move {
                match tokio::fs::read(&index).await {
                    Ok(bytes) => (
                        [(axum::http::header::CONTENT_TYPE, "text/html; charset=utf-8")],
                        bytes,
                    )
                        .into_response(),
                    Err(_) => (StatusCode::NOT_FOUND, "missing index.html").into_response(),
                }
            }
        }));
        app = app.fallback_service(spa);
        tracing::info!("serving SPA from {}", dist.display());
    }

    let app = app.merge(assets.layer(SetResponseHeaderLayer::overriding(
        header::CACHE_CONTROL,
        IMMUTABLE,
    )));

    let listener = match tokio::net::TcpListener::bind(("0.0.0.0", port)).await {
        Ok(l) => l,
        Err(e) if e.kind() == std::io::ErrorKind::AddrInUse => {
            tracing::error!(
                "port {port} is already in use — stop the other server or set PORT to a free port"
            );
            std::process::exit(1);
        }
        Err(e) => {
            tracing::error!("could not bind 0.0.0.0:{port}: {e}");
            std::process::exit(1);
        }
    };
    tracing::info!("listening on http://localhost:{port}");
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    let _ = tokio::signal::ctrl_c().await;
    tracing::info!("shutting down");
}

async fn profile(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    match Profile::load(&state.root) {
        Ok(p) => Json(p).into_response(),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("profile.json: {e}"),
        )
            .into_response(),
    }
}

async fn blog_index(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    read_gen_json(state.root.clone(), "blog-index.json").await
}

async fn blog_post(
    State(state): State<Arc<AppState>>,
    AxPath(slug): AxPath<String>,
) -> impl IntoResponse {
    if !slug.chars().all(|c| c.is_ascii_alphanumeric() || c == '-') {
        return (StatusCode::BAD_REQUEST, "bad slug").into_response();
    }
    let rel = format!("blog/{slug}.json");
    match tokio::fs::read(gen_dir(&state.root).join(&rel)).await {
        Ok(bytes) => (
            [(axum::http::header::CONTENT_TYPE, "application/json")],
            bytes,
        )
            .into_response(),
        Err(_) => (
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({ "error": "not found" })),
        )
            .into_response(),
    }
}

#[derive(Deserialize)]
struct ContactForm {
    name: String,
    email: String,
    message: String,
}

/// Validate a contact message. With no SMTP env configured this runs in "mock"
/// mode (202 + logged); the frontend also offers a `mailto:` fallback.
async fn contact(Json(form): Json<ContactForm>) -> impl IntoResponse {
    let name = form.name.trim();
    let email = form.email.trim();
    let message = form.message.trim();
    if name.is_empty() || message.len() < 5 || !email.contains('@') || email.len() > 254 {
        return (
            StatusCode::UNPROCESSABLE_ENTITY,
            Json(serde_json::json!({ "error": "name, a valid email, and a 5+ char message are required" })),
        )
            .into_response();
    }
    let smtp_url = std::env::var("SMTP_URL").ok().filter(|s| !s.is_empty());
    tracing::info!(%name, %email, configured = smtp_url.is_some(),
        "contact message received ({} chars)", message.len());

    match smtp_url {
        None => (
            StatusCode::ACCEPTED,
            Json(serde_json::json!({ "status": "mock" })),
        )
            .into_response(),
        Some(url) => match send_contact_email(&url, name, email, message).await {
            Ok(()) => (
                StatusCode::ACCEPTED,
                Json(serde_json::json!({ "status": "sent" })),
            )
                .into_response(),
            Err(e) => {
                tracing::error!("contact email failed: {e}");
                (
                    StatusCode::BAD_GATEWAY,
                    Json(serde_json::json!({ "error": "mail delivery failed" })),
                )
                    .into_response()
            }
        },
    }
}

/// Deliver a contact-form message over SMTP. Configuration comes from env:
/// `SMTP_URL` (e.g. `smtps://user:pass@smtp.host:465`), `CONTACT_TO` (recipient),
/// and optional `CONTACT_FROM` (envelope sender; defaults to `CONTACT_TO`).
async fn send_contact_email(
    smtp_url: &str,
    name: &str,
    email: &str,
    message: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    use lettre::message::{header::ContentType, Mailbox};
    use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor};

    let to: String = std::env::var("CONTACT_TO")?;
    let from: String = std::env::var("CONTACT_FROM").unwrap_or_else(|_| to.clone());

    let msg = Message::builder()
        .from(from.parse::<Mailbox>()?)
        .to(to.parse::<Mailbox>()?)
        .reply_to(format!("{name} <{email}>").parse::<Mailbox>()?)
        .subject(format!("Portfolio contact — {name}"))
        .header(ContentType::TEXT_PLAIN)
        .body(format!(
            "From: {name} <{email}>\n\n{message}\n"
        ))?;

    let mailer: AsyncSmtpTransport<Tokio1Executor> =
        AsyncSmtpTransport::<Tokio1Executor>::from_url(smtp_url)?.build();
    mailer.send(msg).await?;
    Ok(())
}

async fn read_gen_json(root: PathBuf, name: &str) -> axum::response::Response {
    match tokio::fs::read(gen_dir(&root).join(name)).await {
        Ok(bytes) => (
            [(axum::http::header::CONTENT_TYPE, "application/json")],
            bytes,
        )
            .into_response(),
        Err(_) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(serde_json::json!({ "error": "blog not generated — run bloggen" })),
        )
            .into_response(),
    }
}
