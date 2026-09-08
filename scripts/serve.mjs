#!/usr/bin/env node
// Cross-platform launcher for the release binary (used by Lighthouse CI and
// any "just run the built thing" need).
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const exe = join(
  root,
  "backend",
  "target",
  "release",
  process.platform === "win32" ? "portfolio-backend.exe" : "portfolio-backend",
);
if (!existsSync(exe)) {
  console.error(`missing ${exe} — run: cargo build --release --manifest-path backend/Cargo.toml`);
  process.exit(1);
}
const child = spawn(exe, { cwd: root, stdio: "inherit", env: process.env });
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
