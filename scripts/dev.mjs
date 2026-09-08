#!/usr/bin/env node
// One command to run the whole thing in development:
//   - checks Rust can link (auto-switches to the GNU toolchain on Windows if needed)
//   - installs frontend deps if missing
//   - generates the static blog JSON
//   - starts the Axum API (:8080) and Vite (:5173, proxying /api) together
import { existsSync, watch } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { ROOT, say, ok, run, spawnPrefixed, ensureRustLinkable, loadEnv, syncResumes } from "./lib.mjs";

loadEnv();
syncResumes();
const API_PORT = process.env.PORT || "8080";
const WEB_PORT = "5173";

say("checking toolchain");
const toolchain = ensureRustLinkable();
ok(`rust: ${toolchain}`);

if (!existsSync(join(ROOT, "frontend", "node_modules"))) {
  say("installing frontend dependencies");
  await run("npm", ["install"], { cwd: join(ROOT, "frontend") });
}

say("generating blog content (bloggen)");
await run("cargo", [
  "run", "--quiet",
  "--manifest-path", "backend/Cargo.toml",
  "--bin", "bloggen", "--", "--dev",
], { env: { ...process.env, CONTENT_ROOT: ROOT } });
ok("blog JSON written to .gen/");

say(`starting API on :${API_PORT} and web on :${WEB_PORT}`);
const api = spawnPrefixed("api", "32", "cargo", [
  "run", "--manifest-path", "backend/Cargo.toml", "--bin", "portfolio-backend",
], { env: { ...process.env, CONTENT_ROOT: ROOT, PORT: API_PORT } });

const web = spawnPrefixed("web", "36", "npm", ["run", "dev"], {
  cwd: join(ROOT, "frontend"),
});

// Live blog: re-run bloggen whenever a post changes, so editing content/blog/*
// shows up on the next browser refresh without restarting the dev server.
const blogDir = join(ROOT, "content", "blog");
let genTimer = null;
let genBusy = false;
if (existsSync(blogDir)) {
  watch(blogDir, { recursive: true }, () => {
    clearTimeout(genTimer);
    genTimer = setTimeout(() => {
      if (genBusy) return;
      genBusy = true;
      const g = spawn(
        "cargo",
        ["run", "--quiet", "--manifest-path", "backend/Cargo.toml", "--bin", "bloggen", "--", "--dev"],
        { cwd: ROOT, env: { ...process.env, CONTENT_ROOT: ROOT }, stdio: ["ignore", "ignore", "inherit"] },
      );
      g.on("exit", (c) => {
        genBusy = false;
        console.log(`\x1b[35m[blog]\x1b[0m ${c === 0 ? "regenerated — refresh the browser" : "bloggen failed"}`);
      });
    }, 250);
  });
  ok("watching content/blog for changes");
}

const stop = () => {
  api.kill();
  web.kill();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of [api, web]) {
  child.on("exit", (code) => {
    if (code) {
      console.error(`\na child process exited with ${code} — shutting down`);
      stop();
    }
  });
}

console.log("\n  API   http://localhost:" + API_PORT + "/api/health");
console.log("  Web   http://localhost:" + WEB_PORT + "   <- open this\n");
