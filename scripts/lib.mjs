// Shared helpers for the dev/build/doctor scripts.
import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const isWin = process.platform === "win32";

const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};
export const say = (m) => console.log(`${C.cyan}▶${C.reset} ${m}`);
export const ok = (m) => console.log(`${C.green}✓${C.reset} ${m}`);
export const warn = (m) => console.log(`${C.yellow}!${C.reset} ${m}`);
export const die = (m) => {
  console.error(`${C.red}✗ ${m}${C.reset}`);
  process.exit(1);
};

export function has(cmd) {
  try {
    execSync(isWin ? `where ${cmd}` : `command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function tryExec(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts }).trim();
  } catch (e) {
    return { error: (e.stderr || e.stdout || e.message || "").toString() };
  }
}

/**
 * Ensure `cargo` can actually link a binary on this machine. On Windows the MSVC
 * toolchain needs Visual Studio Build Tools; if those are missing but a GNU
 * toolchain + gcc are present, switch this directory to the GNU toolchain.
 * Returns the toolchain that will be used, or throws with guidance.
 */
export function ensureRustLinkable() {
  if (!has("cargo")) {
    die(
      "cargo not found. Install Rust from https://rustup.rs and reopen your terminal.",
    );
  }
  const active = tryExec("rustup show active-toolchain", { cwd: ROOT });
  const activeStr = typeof active === "string" ? active : "";

  // Quick probe: does a trivial build link?
  const probe = tryExec("cargo verify-project --manifest-path backend/Cargo.toml", {
    cwd: ROOT,
  });
  void probe; // verify-project doesn't link; we rely on the real build below

  if (isWin && activeStr.includes("msvc")) {
    const hasMsvcLinker = has("link") || existsSync(process.env.VCINSTALLDIR || "");
    if (!hasMsvcLinker) {
      const list = tryExec("rustup toolchain list");
      const gnu = (typeof list === "string" ? list : "")
        .split(/\r?\n/)
        .map((l) => l.replace(/\s*\(.*\)\s*$/, "").trim())
        .find((l) => l.includes("gnu"));
      if (gnu) {
        say(`MSVC linker missing — switching this project to ${gnu}`);
        tryExec(`rustup override set ${gnu}`, { cwd: ROOT });
        if (!has("gcc") && !has("cc")) {
          warn(
            "No gcc/cc on PATH. Install MinGW-w64 (e.g. via MSYS2 or `winget install BrechtSanders.WinLibs.POSIX.UCRT`) and reopen the terminal.",
          );
        }
        return gnu;
      }
      die(
        [
          "Rust can't link on this machine.",
          "Fix ONE of:",
          "  a) install 'Desktop development with C++' (MSVC Build Tools), or",
          "  b) rustup toolchain install stable-x86_64-pc-windows-gnu   (then install MinGW-w64 gcc)",
          "Then run this again.",
        ].join("\n"),
      );
    }
  }
  return activeStr || "default";
}

// `cargo` is a real .exe (no shell needed); `npm`/`npx` on Windows are .cmd wrappers.
const shellFor = (cmd) => isWin && (cmd === "npm" || cmd === "npx");

export function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd: ROOT, stdio: "inherit", shell: shellFor(cmd), ...opts });
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
    p.on("error", reject);
  });
}

/** Spawn a long-lived child, prefixing each output line. Returns the ChildProcess. */
export function spawnPrefixed(label, color, cmd, args, opts = {}) {
  const p = spawn(cmd, args, { cwd: ROOT, shell: shellFor(cmd), ...opts });
  const tag = `\x1b[${color}m[${label}]\x1b[0m `;
  const pipe = (stream, out) => {
    let buf = "";
    stream.on("data", (d) => {
      buf += d.toString();
      const lines = buf.split(/\r?\n/);
      buf = lines.pop() ?? "";
      for (const l of lines) out.write(tag + l + "\n");
    });
  };
  pipe(p.stdout, process.stdout);
  pipe(p.stderr, process.stderr);
  return p;
}
