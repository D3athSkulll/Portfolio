//! Axum server: serves `profile.json`, the statically generated blog JSON, and
//! (in production) the built frontend.

use std::path::PathBuf;
use std::sync::Arc;

use axum::extract::{Path as AxPath, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::Deserialize;
use portfolio_backend::model::Profile;
use portfolio_backend::{blog_assets_dir, content_root, gen_dir};
use tower_http::cors::CorsLayer;
use tower_http::services::{ServeDir, ServeFile};
use tower_http::trace::TraceLayer;

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

    let port: u16 = std::env::var("PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(8080);

    let mut app = Router::new()
        .route("/api/health", get(|| async { Json(serde_json::json!({ "status": "ok" })) }))
        .route("/api/profile", get(profile))
        .route("/api/blog", get(blog_index))
        .route("/api/blog/:slug", get(blog_post))
        .route("/api/contact", post(contact))
        .nest_service("/blog-assets", ServeDir::new(blog_assets_dir(&root)))
        .with_state(state)
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    // Serve the built SPA if it exists (production single-binary mode).
    let dist = root.join("frontend").join("dist");
    if dist.is_dir() {
        let index = dist.join("index.html");
        app = app.fallback_service(
            ServeDir::new(&dist).not_found_service(ServeFile::new(index)),
        );
        tracing::info!("serving SPA from {}", dist.display());
    }

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port)).await.unwrap();
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
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, format!("profile.json: {e}")).into_response(),
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
        Ok(bytes) => ([(axum::http::header::CONTENT_TYPE, "application/json")], bytes).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, Json(serde_json::json!({ "error": "not found" }))).into_response(),
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
    let configured = std::env::var("SMTP_URL").is_ok();
    tracing::info!(%name, %email, configured, "contact message received ({} chars)", message.len());
    (
        StatusCode::ACCEPTED,
        Json(serde_json::json!({ "status": if configured { "sent" } else { "mock" } })),
    )
        .into_response()
}

async fn read_gen_json(root: PathBuf, name: &str) -> axum::response::Response {
    match tokio::fs::read(gen_dir(&root).join(name)).await {
        Ok(bytes) => ([(axum::http::header::CONTENT_TYPE, "application/json")], bytes).into_response(),
        Err(_) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(serde_json::json!({ "error": "blog not generated — run bloggen" })),
        )
            .into_response(),
    }
}
