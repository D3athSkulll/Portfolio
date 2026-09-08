#!/usr/bin/env node
// Diagnose why the project won't run. Prints what's installed and what to fix.
import { has, tryExec, isWin, say, ok, warn } from "./lib.mjs";

say("environment check\n");

const node = process.version;
ok(`node ${node}`);

if (has("cargo")) {
  ok(tryExec("cargo --version"));
  const tc = tryExec("rustup show active-toolchain");
  console.log("  active toolchain:", typeof tc === "string" ? tc : "(unknown)");
  const list = tryExec("rustup toolchain list");
  if (typeof list === "string") console.log("  installed:\n" + list.replace(/^/gm, "    "));
} else {
  warn("cargo NOT found — install Rust: https://rustup.rs");
}

const linkers = ["link", "gcc", "cc", "clang"].filter(has);
console.log("  linkers on PATH:", linkers.length ? linkers.join(", ") : "(none)");

if (isWin) {
  const tc = tryExec("rustup show active-toolchain");
  const usingMsvc = typeof tc === "string" && tc.includes("msvc");
  if (usingMsvc && !has("link")) {
    warn(
      [
        "",
        "Windows + MSVC toolchain but no MSVC linker (link.exe).",
        "Pick one:",
        "  a) Install 'Desktop development with C++' from the Visual Studio Build Tools installer.",
        "  b) Use the GNU toolchain instead:",
        "       rustup toolchain install stable-x86_64-pc-windows-gnu",
        "       winget install BrechtSanders.WinLibs.POSIX.UCRT.Base   (provides gcc)",
        "     Then `npm run dev` will switch this project to it automatically.",
      ].join("\n"),
    );
  } else {
    ok("Rust should be able to link on this machine");
  }
}

console.log("\nrun the app with:  npm run dev");
