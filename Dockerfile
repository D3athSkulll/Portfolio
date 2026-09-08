# syntax=docker/dockerfile:1

# 1. Rust: build the server + run the static blog generator
FROM rust:1-slim AS rust
WORKDIR /app
COPY backend/Cargo.toml backend/Cargo.lock* backend/
COPY backend/src backend/src
COPY profile.json .
COPY content content
RUN cd backend && cargo build --release --bin portfolio-backend --bin bloggen
# writes .gen/ and frontend/public/blog-assets/
RUN cd backend && CONTENT_ROOT=/app cargo run --release --bin bloggen

# 2. Node: build the SPA (picks up blog-assets from the rust stage)
FROM node:24-slim AS web
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
COPY --from=rust /app/frontend/public/blog-assets ./public/blog-assets
RUN npm run build

# 3. Runtime: one binary + generated assets
FROM debian:bookworm-slim AS runtime
WORKDIR /app
ENV PORT=8080 CONTENT_ROOT=/app
COPY --from=rust /app/backend/target/release/portfolio-backend /usr/local/bin/
COPY --from=rust /app/.gen ./.gen
COPY --from=web /app/frontend/dist ./frontend/dist
COPY --from=rust /app/frontend/public/blog-assets ./frontend/public/blog-assets
COPY profile.json ./
EXPOSE 8080
CMD ["portfolio-backend"]
