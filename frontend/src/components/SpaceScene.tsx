import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "../theme";
import { createInvaders, createBreakout, type GameEnv, type GameId, type SpaceGame } from "./spaceGames";

/**
 * SPACE-theme background:
 *  1. drifting star-field (tsparticles) at z -20
 *  2. an ambient Space-Invaders skirmish on a <canvas> while the portfolio shows
 *  3. press SPACE to hide the UI and play — TAB switches between the
 *     Space-Invaders shooter and a Breakout run; both have enemy/brick types,
 *     powerups, waves, lives and a MISSION FAILED screen. ESC returns.
 */
export default function SpaceScene() {
  const { theme } = useTheme();
  if (theme !== "space") return null;
  return (
    <>
      <StarField />
      <GameCanvas />
    </>
  );
}

/* ------------------------------------------------------------------ starfield */

let enginePromise: Promise<void> | null = null;

function StarField() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    enginePromise ??= initParticlesEngine((e) => loadSlim(e));
    enginePromise.then(() => setReady(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: -20 },
      background: { color: "transparent" },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 140, density: { enable: true, width: 1920, height: 1080 } },
        color: { value: ["#cfe4ff", "#7dd3fc", "#39ff9e", "#ffb648"] },
        opacity: { value: { min: 0.15, max: 0.9 }, animation: { enable: true, speed: 0.5, sync: false } },
        size: { value: { min: 0.4, max: 1.9 } },
        move: {
          enable: true,
          speed: 0.16,
          direction: "bottom" as const,
          straight: false,
          outModes: { default: "out" as const },
        },
      },
    }),
    [],
  );

  if (!ready) return null;
  return <Particles id="starfield" options={options} />;
}

/* --------------------------------------------------------------- game canvas */

function cssVar(name: string, fb: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fb;
}

function GameCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [game, setGame] = useState<GameId>("invaders");
  const playingRef = useRef(false);
  const gameRef = useRef<GameId>("invaders");
  playingRef.current = playing;
  gameRef.current = game;

  const overRef = useRef({ v: false });
  const resetActiveRef = useRef<() => void>(() => {});

  // SPACE toggles play / retries; TAB switches game; ESC exits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (playingRef.current && overRef.current.v) resetActiveRef.current();
        else setPlaying((p) => !p);
      } else if (e.code === "Escape" && playingRef.current) {
        setPlaying(false);
      } else if (e.code === "Tab" && playingRef.current) {
        e.preventDefault();
        setGame((g) => (g === "invaders" ? "breakout" : "invaders"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("space-play", playing);
    return () => document.documentElement.classList.remove("space-play");
  }, [playing]);

  // fresh run whenever play mode is entered/left or the active game changes
  useEffect(() => {
    resetActiveRef.current();
  }, [playing, game]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const C = {
      ship: cssVar("--accent", "#ffb648"),
      cockpit: cssVar("--accent-2", "#38bdf8"),
      bullet: cssVar("--hud", "#39ff9e"),
      hud: cssVar("--hud", "#39ff9e"),
      dim: cssVar("--muted", "#6a819a"),
      fg: cssVar("--panel-fg", "#cfe4ff"),
    };

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const input = { x: W / 2, clicked: false };
    const onUi = (e: Event) => !!(e.target as HTMLElement)?.closest?.("[data-space-ui]");
    const onMove = (e: PointerEvent) => {
      if (onUi(e)) return;
      input.x = e.clientX;
      if (playingRef.current) e.preventDefault();
    };
    const onDown = (e: PointerEvent) => {
      if (onUi(e)) return;
      input.x = e.clientX; // let a touch also aim the paddle/ship immediately
      if (playingRef.current && overRef.current.v) resetActiveRef.current();
      else input.clicked = true;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerdown", onDown);

    const env: GameEnv = {
      ctx,
      size: () => ({ W, H }),
      input,
      playing: () => playingRef.current,
      over: overRef.current,
      reduced,
      C,
    };

    const games: Record<GameId, SpaceGame> = {
      invaders: createInvaders(env),
      breakout: createBreakout(env),
    };
    const active = () =>
      playingRef.current && gameRef.current === "breakout" ? games.breakout : games.invaders;
    resetActiveRef.current = () => {
      overRef.current.v = false;
      active().reset();
    };
    games.invaders.reset();
    games.breakout.reset();

    let raf = 0;
    const loop = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      active().step(t);
      // game-switch hint (play mode only)
      if (playingRef.current && !overRef.current.v) {
        ctx.font = "11px ui-monospace, monospace";
        ctx.fillStyle = C.dim;
        ctx.textAlign = "right";
        ctx.fillText(
          (gameRef.current === "invaders" ? "INVADERS" : "BREAKOUT") + "  ·  TAB ▸ SWITCH GAME",
          W - 18,
          H - 16,
        );
        ctx.textAlign = "left";
      }
      raf = requestAnimationFrame(loop);
    };
    if (reduced) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      games.invaders.step(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const btn: React.CSSProperties = {
    font: "600 12px ui-monospace, monospace",
    letterSpacing: "0.12em",
    color: "#7dd3fc",
    background: "rgba(3,10,18,0.9)",
    border: "1px solid #38bdf8",
    boxShadow: "0 0 12px rgba(56,189,248,0.35)",
    padding: "10px 14px",
    minHeight: 44,
    minWidth: 44,
    textTransform: "uppercase",
    cursor: "pointer",
    lineHeight: 1,
    WebkitTapHighlightColor: "transparent",
  };
  const quitBtn: React.CSSProperties = { ...btn, color: "#ff9b9b", border: "1px solid #ff6b6b", boxShadow: "0 0 12px rgba(255,107,107,0.3)" };

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          // ambient: sit just above the page (incl. the footer) so the ship's
          // drift stays visible; play mode: above everything.
          zIndex: playing ? 60 : 3,
          pointerEvents: playing ? "auto" : "none",
          cursor: playing ? "crosshair" : "auto",
          touchAction: "none",
        }}
      />
      <div
        data-space-ui
        style={{
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 70,
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {!playing ? (
          <button style={btn} onClick={() => setPlaying(true)}>
            ▸ Play Game
          </button>
        ) : (
          <>
            <button
              style={btn}
              onClick={() => setGame((g) => (g === "invaders" ? "breakout" : "invaders"))}
            >
              ⇆ {game === "invaders" ? "Breakout" : "Invaders"}
            </button>
            <button style={btn} onClick={() => resetActiveRef.current()}>
              ↻ Retry
            </button>
            <button style={quitBtn} onClick={() => setPlaying(false)}>
              ✕ Quit
            </button>
          </>
        )}
      </div>
      {playing && (
        <p
          data-space-ui
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 6,
            margin: 0,
            textAlign: "center",
            font: "10px ui-monospace, monospace",
            letterSpacing: "0.14em",
            color: "#6a819a",
            zIndex: 70,
            pointerEvents: "none",
          }}
        >
          DRAG TO MOVE · TAP TO FIRE / RELEASE
        </p>
      )}
    </>
  );
}
