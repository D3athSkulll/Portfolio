#!/usr/bin/env node
// Full production build:
//   validate profile.json -> check blog content -> bloggen -> vite build -> cargo --release
// Output: one runnable binary (backend/target/release/portfolio-backend) that serves
// the SPA, the API and the generated blog. Run it with `npm start`.
import { join } from "node:path";
import { ROOT, say, ok, run, ensureRustLinkable, syncResumes } from "./lib.mjs";

const toolchain = ensureRustLinkable();
ok(`rust: ${toolchain}`);

say("sync résumés from content/resumes/");
ok(`${syncResumes()} file(s) copied to frontend/public/`);

say("validate profile.json");
await run("node", ["scripts/validate-profile.mjs"]);

say("check blog content");
await run("node", ["scripts/blog.mjs", "check"]);

say("generate blog JSON + assets (bloggen)");
await run(
  "cargo",
  ["run", "--quiet", "--manifest-path", "backend/Cargo.toml", "--bin", "bloggen", "--", "--dev"],
  { env: { ...process.env, CONTENT_ROOT: ROOT } },
);

say("build frontend (vite)");
await run("npm", ["run", "build"], { cwd: join(ROOT, "frontend") });

say("build backend (cargo --release)");
await run("cargo", ["build", "--release", "--manifest-path", "backend/Cargo.toml"]);

ok("done — run `npm start` then open http://localhost:8080");
