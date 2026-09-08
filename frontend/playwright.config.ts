import { defineConfig } from "@playwright/test";

// Smoke tests run against the single production binary (Axum serving the built
// SPA + generated blog JSON). Build order the CI/`npm run build` guarantees:
//   validate-profile → blog:check → bloggen → vite build → cargo build --release
const PORT = 8080;

export default defineConfig({
  testDir: "./e2e",
  timeout: 15_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    // locally reuse the system Chrome (no download); in CI use bundled chromium
    channel: process.env.CI ? undefined : "chrome",
  },
  webServer: {
    command:
      "cargo run --release --manifest-path ../backend/Cargo.toml --bin portfolio-backend",
    env: { CONTENT_ROOT: "..", PORT: String(PORT) },
    url: `http://localhost:${PORT}/api/health`,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
