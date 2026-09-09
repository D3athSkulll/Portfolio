/**
 * The two SPACE-theme mini-games. Each is a plain factory that takes a shared
 * `GameEnv` and returns `{ reset, step }`. `SpaceScene.tsx` owns the canvas,
 * the rAF loop, input and the SPACE / ESC / TAB keys.
 */

export type GameId = "invaders" | "breakout";

export interface GameEnv {
  ctx: CanvasRenderingContext2D;
  size: () => { W: number; H: number };
  input: { x: number; clicked: boolean };
  playing: () => boolean;
  over: { v: boolean };
  reduced: boolean;
  C: Record<string, string>;
}

export interface SpaceGame {
  reset: () => void;
  step: (now: number) => void;
}

/* ------------------------------------------------------------------ helpers */

const RED = "#ff6b6b";

export function px(
  ctx: CanvasRenderingContext2D,
  grid: string[],
  ox: number,
  oy: number,
  s: number,
  c: string,
) {
  ctx.fillStyle = c;
  for (let r = 0; r < grid.length; r++)
    for (let cc = 0; cc < grid[r].length; cc++)
      if (grid[r][cc] === "#") ctx.fillRect(ox + cc * s, oy + r * s, s, s);
}

function deathScreen(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  line1: string,
  line2: string,
  C: Record<string, string>,
) {
  ctx.fillStyle = "rgba(3,6,12,0.8)";
  ctx.fillRect(-40, -40, W + 80, H + 80);
  ctx.textAlign = "center";
  ctx.fillStyle = RED;
  ctx.font = "700 46px ui-monospace, monospace";
  ctx.fillText("MISSION FAILED", W / 2, H / 2 - 30);
  ctx.fillStyle = C.fg;
  ctx.font = "16px ui-monospace, monospace";
  ctx.fillText(line1, W / 2, H / 2 + 8);
  ctx.fillStyle = C.hud;
  ctx.font = "13px ui-monospace, monospace";
  ctx.fillText(line2, W / 2, H / 2 + 40);
  ctx.textAlign = "left";
}

/* ================================================================ INVADERS */

const GRUNT = [
  "  #     #  ",
  "   #   #   ",
  "  #######  ",
  " ## ### ## ",
  "###########",
  "# ####### #",
  "# #     # #",
  "   ## ##   ",
];
const DARTER = ["   #   ", "  ###  ", " ##### ", "## # ##", "#  #  #"];
const WEAVER = ["  #   #  ", "  #####  ", " ####### ", "## ### ##", "#   #   #"];
const BOMBER = ["    #    ", "  #####  ", " ####### ", " ####### ", "  #####  ", "   ###   "];
const BULWARK = ["  #####  ", " ####### ", "#########", "#########", "## ### ##", " #     # "];
const TANK = [
  "  #######  ",
  " ######### ",
  "###########",
  "## ##### ##",
  "###########",
  "#  #####  #",
  "## ##### ##",
  "#         #",
  " ##     ## ",
];
const UFO = ["    #####    ", "  #########  ", "#############", "  ## ### ##  ", "   #  #  #   "];
const SHIP = [
  "      #      ",
  "     ###     ",
  "     ###     ",
  "    #####    ",
  "   #######   ",
  " ## ##### ## ",
  "### ##### ###",
  "##  #####  ##",
  "#   # # #   #",
  "    #   #    ",
  "   ##   ##   ",
];

type Kind = "grunt" | "darter" | "weaver" | "bomber" | "bulwark" | "tank" | "splitter" | "carrier" | "ufo";
type Gun =
  | "blaster" | "twin" | "spread" | "wave" | "laser" | "homing"
  | "scatter" | "railgun" | "flak" | "arc";
type PUType = "rapid" | "shield" | "nuke" | "life" | `gun:${Gun}`;

interface Enemy {
  k: Kind; x: number; y: number; vx: number; vy: number;
  hp: number; max: number; ph: number; flash: number; t0: number; fire: number;
}
interface Bullet {
  x: number; y: number; vx: number; vy: number; foe: boolean;
  dmg?: number; pierce?: number; homing?: boolean; grav?: number; aoe?: number; chain?: number; rail?: boolean;
}
interface Mine { x: number; y: number; arm: number; fuse: number }
interface Drop { x: number; y: number; vy: number; t: PUType }
interface Bolt { ax: number; ay: number; bx: number; by: number; life: number }
interface Pop { x: number; y: number; s: string; life: number; c: string }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; c: string }

const ISPEC: Record<Kind, { hp: number; sprite: string[]; sc: number; pts: number; col: string }> = {
  grunt: { hp: 1, sprite: GRUNT, sc: 2, pts: 10, col: "#38bdf8" },
  darter: { hp: 1, sprite: DARTER, sc: 2, pts: 20, col: "#ffb648" },
  weaver: { hp: 1, sprite: WEAVER, sc: 2, pts: 22, col: "#7dd3fc" },
  bomber: { hp: 2, sprite: BOMBER, sc: 2.2, pts: 30, col: "#ff8fb3" },
  bulwark: { hp: 4, sprite: BULWARK, sc: 2.4, pts: 45, col: "#a78bfa" },
  tank: { hp: 3, sprite: TANK, sc: 2.6, pts: 40, col: RED },
  splitter: { hp: 1, sprite: GRUNT, sc: 2, pts: 15, col: "#a78bfa" },
  carrier: { hp: 9, sprite: TANK, sc: 3.7, pts: 120, col: RED },
  ufo: { hp: 2, sprite: UFO, sc: 2.2, pts: 60, col: "#39ff9e" },
};

const GUNS: Gun[] = [
  "twin", "spread", "wave", "laser", "homing", "scatter", "railgun", "flak", "arc",
];
const GSPEC: Record<Gun, { gap: number; label: string; col: string; ch: string }> = {
  blaster: { gap: 140, label: "BLASTER", col: "#39ff9e", ch: "•" },
  twin: { gap: 150, label: "TWIN BOLT", col: "#ffd27a", ch: "=" },
  spread: { gap: 175, label: "SPREAD", col: "#38bdf8", ch: "Y" },
  wave: { gap: 230, label: "WAVE", col: "#7dd3fc", ch: "W" },
  laser: { gap: 58, label: "LANCE", col: RED, ch: "L" },
  homing: { gap: 210, label: "SEEKER", col: "#a78bfa", ch: "H" },
  scatter: { gap: 300, label: "SCATTER", col: "#ffb648", ch: "*" },
  railgun: { gap: 430, label: "RAILGUN", col: "#ffffff", ch: "I" },
  flak: { gap: 340, label: "FLAK", col: "#ff8fb3", ch: "F" },
  arc: { gap: 250, label: "ARC", col: "#7dd3fc", ch: "Z" },
};

const IPU: Record<string, { ch: string; col: string }> = {
  rapid: { ch: "R", col: "#ffb648" },
  shield: { ch: "S", col: "#39ff9e" },
  nuke: { ch: "N", col: "#ffffff" },
  life: { ch: "+", col: "#ff8fb3" },
};
const puCol = (t: PUType) => (t.startsWith("gun:") ? GSPEC[t.slice(4) as Gun].col : IPU[t].col);
const puCh = (t: PUType) => (t.startsWith("gun:") ? GSPEC[t.slice(4) as Gun].ch : IPU[t].ch);
const puLabel = (t: PUType) =>
  t.startsWith("gun:") ? GSPEC[t.slice(4) as Gun].label : t.toUpperCase();

export function createInvaders(env: GameEnv): SpaceGame {
  const { ctx, C } = env;

  let ship = { x: 0, y: 0 };
  let enemies: Enemy[] = [];
  let bullets: Bullet[] = [];
  let mines: Mine[] = [];
  let drops: Drop[] = [];
  let bolts: Bolt[] = [];
  let pops: Pop[] = [];
  let sparks: Spark[] = [];
  let score = 0;
  let wave = 1;
  let kills = 0;
  let lives = 3;
  let invuln = 0;
  let shieldHp = 0;
  let rapidUntil = 0;
  let gun: Gun = "blaster";
  let shake = 0;
  let flashA = 0;
  let banner = 0;
  let lastShot = 0;
  let lastSpawn = 0;

  const reset = () => {
    const { W, H } = env.size();
    ship = { x: W / 2, y: H - 96 };
    enemies = [];
    bullets = [];
    mines = [];
    drops = [];
    bolts = [];
    pops = [];
    sparks = [];
    score = 0;
    wave = 1;
    kills = 0;
    lives = 3;
    invuln = shieldHp = rapidUntil = 0;
    gun = "blaster";
    shake = flashA = 0;
    banner = performance.now();
    env.over.v = false;
  };

  const boom = (x: number, y: number, c: string, n = 14) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 0.6 + Math.random() * 2.8;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c });
    }
  };
  const pop = (x: number, y: number, s: string, c: string) => pops.push({ x, y, s, life: 1, c });

  const mkEnemy = (k: Kind, x: number, y: number, vx = 0, vy = 0): Enemy => {
    const sp = ISPEC[k];
    return { k, x, y, vx, vy, hp: sp.hp, max: sp.hp, ph: Math.random() * 6.28, flash: 0, t0: performance.now(), fire: 0 };
  };

  const spawn = (play: boolean, now: number) => {
    const { W } = env.size();
    let k: Kind = "grunt";
    const r = Math.random();
    if (play) {
      if (r < 0.02) k = "ufo";
      else if (now - banner < 1400) k = "grunt";
      else if (wave >= 2 && r < 0.1) k = "tank";
      else if (wave >= 2 && r < 0.17) k = "weaver";
      else if (wave >= 3 && r < 0.23) k = "bulwark";
      else if (wave >= 3 && r < 0.28) k = "bomber";
      else if (wave >= 4 && r < 0.32) k = "splitter";
      else if (wave >= 5 && r < 0.35) k = "carrier";
      else if (r < 0.62) k = "darter";
      else k = "grunt";
    } else {
      k = r < 0.18 ? "weaver" : r < 0.4 ? "darter" : "grunt";
    }
    if (k === "ufo") {
      const dir = Math.random() < 0.5 ? 1 : -1;
      enemies.push(mkEnemy("ufo", dir < 0 ? W + 30 : -30, 46, dir * (1.4 + wave * 0.1), 0));
      return;
    }
    const e = mkEnemy(k, 30 + Math.random() * (W - 60), -26);
    e.vx = (Math.random() - 0.5) * (k === "darter" ? 1.4 : 0.4);
    e.vy = (k === "tank" || k === "carrier" ? 0.16 : k === "darter" ? 0.5 : 0.28) +
      Math.random() * 0.3 + (play ? wave * 0.04 : 0);
    enemies.push(e);
  };

  const kill = (e: Enemy, idx: number, play: boolean, now: number) => {
    const sp = ISPEC[e.k];
    boom(e.x, e.y, sp.col, e.k === "carrier" ? 34 : e.k === "tank" ? 22 : 14);
    enemies.splice(idx, 1);
    if (!play) {
      score++;
      return;
    }
    score += sp.pts;
    pop(e.x, e.y, "+" + sp.pts, sp.col);
    kills++;
    if (e.k === "splitter" || e.k === "carrier")
      for (let j = 0; j < 2; j++) enemies.push(mkEnemy("grunt", e.x, e.y, (j ? 1 : -1) * 1.4, 0.4));
    const dc =
      e.k === "ufo" || e.k === "carrier" ? 1 :
      e.k === "bulwark" ? 0.7 :
      e.k === "bomber" ? 0.5 :
      e.k === "tank" ? 0.7 :
      e.k === "darter" || e.k === "weaver" ? 0.38 : 0.32;
    if (Math.random() < dc) {
      let t: PUType;
      const rr = Math.random();
      if (rr < 0.62) {
        const opts = GUNS.filter((g) => g !== gun);
        t = `gun:${opts[(Math.random() * opts.length) | 0]}`;
      } else if (rr < 0.78) t = "rapid";
      else if (rr < 0.9) t = "shield";
      else if (rr < 0.97) t = "nuke";
      else t = "life";
      drops.push({ x: e.x, y: e.y, vy: 1.1, t });
    }
    if (kills >= 12 + wave * 3) {
      wave++;
      kills = 0;
      banner = now;
    }
  };

  const aoe = (x: number, y: number, r: number, play: boolean, now: number) => {
    boom(x, y, "#ff8fb3", 18);
    shake = Math.max(shake, 8);
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if ((e.x - x) ** 2 + (e.y - y) ** 2 < r * r) {
        e.flash = 4;
        if ((e.hp -= 1) <= 0) kill(e, j, play, now);
      }
    }
  };

  const hurt = (now: number) => {
    if (now < invuln || env.over.v) return;
    if (shieldHp > 0) {
      shieldHp--;
      pop(ship.x, ship.y - 30, "SHIELD", C.hud);
      shake = 8;
      return;
    }
    lives--;
    invuln = now + 1600;
    shake = 16;
    boom(ship.x, ship.y, C.ship, 26);
    if (lives <= 0) env.over.v = true;
  };

  const collect = (d: Drop, now: number, play: boolean) => {
    pop(ship.x, ship.y - 34, puLabel(d.t), puCol(d.t));
    if (d.t.startsWith("gun:")) {
      gun = d.t.slice(4) as Gun;
      lastShot = 0;
    } else if (d.t === "rapid") rapidUntil = now + 8000;
    else if (d.t === "shield") shieldHp = 3;
    else if (d.t === "life") lives = Math.min(6, lives + 1);
    else if (d.t === "nuke") {
      flashA = 1;
      shake = 14;
      for (let i = enemies.length - 1; i >= 0; i--) kill(enemies[i], i, play, now);
    }
  };

  const drawShip = () => {
    const s = 2.4;
    const w = SHIP[0].length * s;
    const ox = ship.x - w / 2;
    const oy = ship.y - SHIP.length * s;
    const fl = 6 + Math.random() * 10;
    const g = ctx.createLinearGradient(0, ship.y, 0, ship.y + fl);
    g.addColorStop(0, C.bullet);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(ship.x - 8, ship.y - 2, 4, fl);
    ctx.fillRect(ship.x + 4, ship.y - 2, 4, fl);
    const blink = performance.now() < invuln && ((performance.now() / 80) | 0) % 2 === 0;
    ctx.globalAlpha = blink ? 0.35 : 1;
    ctx.shadowColor = C.ship;
    ctx.shadowBlur = 10;
    px(ctx, SHIP, ox, oy, s, C.ship);
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.cockpit;
    ctx.fillRect(ship.x - s, oy + 3 * s, s * 2, s * 2);
    ctx.globalAlpha = 1;
    if (shieldHp > 0) {
      ctx.strokeStyle = C.hud;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ship.x, ship.y - 12, 26, 0, 6.283);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  // caller sets up the base device-pixel transform each frame; we just render.
  const render = (now: number) => {
    const { W, H } = env.size();
    const play = env.playing();

    if (shake > 0.3) {
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      shake *= 0.86;
    }
    ctx.clearRect(-60, -60, W + 120, H + 120);

    ship.y = play ? H - 96 : H - 74;
    let clickFire = false;
    if (env.input.clicked) {
      env.input.clicked = false;
      clickFire = true;
    }

    if (!env.over.v) {
      let target: Enemy | null = null;
      let best = Infinity;
      for (const e of enemies) {
        const d = Math.abs(e.x - ship.x) + Math.abs(e.y - ship.y) * 0.3;
        if (d < best) (best = d), (target = e);
      }
      const goalX = play ? env.input.x : target ? target.x : W / 2;
      ship.x += (goalX - ship.x) * (play ? 0.24 : 0.045);
      ship.x = Math.max(28, Math.min(W - 28, ship.x));

      const gap = play ? Math.max(340, 640 - wave * 42) : 950;
      const cap = play ? 10 + wave * 3 : 14;
      if (now - lastSpawn > gap && enemies.length < cap) (lastSpawn = now), spawn(play, now);

      const rapid = now < rapidUntil;
      const g: Gun = play ? gun : "blaster";
      const fireGap = play ? Math.round(GSPEC[g].gap * (rapid ? 0.5 : 1)) : 240;
      const wantsFire = play ? clickFire || now - lastShot > 340 : !!target;
      if (wantsFire && now - lastShot > fireGap) {
        lastShot = now;
        const bx = ship.x;
        const by = ship.y - 26;
        const aim = play ? 0 : ((target as Enemy).x - ship.x) * 0.03;
        const shot = (vx: number, vy: number, ex?: Partial<Bullet>) =>
          bullets.push({ x: bx, y: by, vx, vy, foe: false, ...ex });
        switch (g) {
          case "twin": shot(aim, -7); bullets.push({ x: bx - 6, y: by, vx: aim, vy: -7, foe: false }); bullets.push({ x: bx + 6, y: by, vx: aim, vy: -7, foe: false }); break;
          case "spread": shot(aim - 2.4, -6.6); shot(aim, -7.4); shot(aim + 2.4, -6.6); break;
          case "wave": for (let k = -2; k <= 2; k++) shot(aim + k * 2.1, -6.4 - Math.abs(k) * 0.1); break;
          case "laser": shot(aim * 0.5, -12, { pierce: 2 }); break;
          case "homing": shot(-1.4, -6.5, { homing: true }); shot(1.4, -6.5, { homing: true }); break;
          case "scatter": for (let k = 0; k < 7; k++) shot(aim + (Math.random() - 0.5) * 6, -5.5 - Math.random() * 3); break;
          case "railgun": shot(0, -20, { pierce: 6, dmg: 2, rail: true }); break;
          case "flak": for (let k = -1; k <= 1; k++) shot(aim + k * 1.3, -5.6, { grav: 0.14, aoe: 46 }); break;
          case "arc": shot(aim, -7.2, { chain: 3 }); break;
          default: shot(aim, -7);
        }
      }
    }

    // enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.ph += 0.08;
      if (e.flash > 0) e.flash--;
      if (e.k === "ufo") {
        e.x += e.vx;
        e.y += Math.sin(e.ph) * 0.4;
        if (e.x < -60 || e.x > W + 60) enemies.splice(i, 1);
        continue;
      }
      const dx = ship.x - e.x;
      const dy = ship.y - e.y;
      const pull = e.k === "darter" || e.k === "weaver" ? 0.011 : 0.02;
      e.vx += Math.max(-1, Math.min(1, dx / 380)) * (play ? pull * 1.4 : pull);
      if (e.k === "darter") e.vx += Math.sin(e.ph * 3) * 0.06;
      if (e.k === "weaver") e.vx = Math.sin(e.ph * 2.2) * 2.6 + dx / 900;
      e.vy += 0.004 + Math.max(0, dy) * 0.000012;
      const vmax = (e.k === "darter" || e.k === "weaver" ? 2.7 : e.k === "tank" || e.k === "carrier" ? 1.0 : 1.8) + (play ? wave * 0.14 : 0);
      e.vx = Math.max(-vmax, Math.min(vmax, e.vx));
      e.vy = Math.max(0.1, Math.min(vmax, e.vy));
      e.x += e.vx;
      e.y += e.vy + Math.sin(e.ph) * 0.3;

      if (play && !env.over.v) {
        if ((e.k === "tank" || e.k === "darter" || e.k === "weaver") && Math.random() < 0.004 && e.y < ship.y - 60) {
          const a = Math.atan2(ship.y - e.y, ship.x - e.x);
          bullets.push({ x: e.x, y: e.y + 8, vx: Math.cos(a) * 2.6, vy: Math.sin(a) * 2.6, foe: true });
        }
        if (e.k === "bomber" && now - e.fire > 1600) {
          e.fire = now;
          mines.push({ x: e.x, y: e.y + 10, arm: now + 900, fuse: now + 6000 });
        }
        if (e.k === "carrier" && now - e.fire > 1700) {
          e.fire = now;
          enemies.push(mkEnemy("grunt", e.x + (Math.random() - 0.5) * 30, e.y + 20, 0, 0.6));
        }
      }

      if (e.y > H + 30 || e.x < -70 || e.x > W + 70) enemies.splice(i, 1);
      else if (dy < 30 && Math.abs(dx) < 24) {
        if (play) hurt(now);
        boom(e.x, e.y, ISPEC[e.k].col);
        enemies.splice(i, 1);
      }
    }

    // mines
    for (let i = mines.length - 1; i >= 0; i--) {
      const m = mines[i];
      const armed = now > m.arm;
      const near = (m.x - ship.x) ** 2 + (m.y - ship.y) ** 2 < 44 * 44;
      if (armed && (near || now > m.fuse)) {
        boom(m.x, m.y, "#ff8fb3", 16);
        if (play && near) hurt(now);
        aoe(m.x, m.y, 40, play, now);
        mines.splice(i, 1);
      }
    }

    // bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      if (b.homing && !b.foe) {
        let tx = b.x, ty = -100, bd = Infinity;
        for (const e of enemies) {
          const d = (e.x - b.x) ** 2 + (e.y - b.y) ** 2;
          if (d < bd) (bd = d), (tx = e.x), (ty = e.y);
        }
        const a = Math.atan2(ty - b.y, tx - b.x);
        const sp = Math.hypot(b.vx, b.vy) || 7;
        b.vx += (Math.cos(a) * sp - b.vx) * 0.12;
        b.vy += (Math.sin(a) * sp - b.vy) * 0.12;
      }
      if (b.grav) b.vy += b.grav;
      b.x += b.vx;
      b.y += b.vy;
      if (b.grav && b.aoe && b.vy > 5.5) {
        aoe(b.x, b.y, b.aoe, play, now);
        bullets.splice(i, 1);
        continue;
      }
      if (b.y < -40 || b.y > H + 24 || b.x < -30 || b.x > W + 30) {
        bullets.splice(i, 1);
        continue;
      }
      if (b.foe) {
        if (play && !env.over.v && Math.abs(b.x - ship.x) < 13 && Math.abs(b.y - (ship.y - 12)) < 16) {
          bullets.splice(i, 1);
          hurt(now);
        }
        continue;
      }
      let done = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        const rw = ISPEC[e.k].sprite[0].length * ISPEC[e.k].sc * 0.5;
        if (Math.abs(e.x - b.x) < rw && Math.abs(e.y - b.y) < 12) {
          e.flash = 4;
          const dmg = e.k === "bulwark" ? Math.min(b.dmg ?? 1, 1) : b.dmg ?? 1;
          if ((e.hp -= dmg) <= 0) kill(e, j, play, now);
          if (b.aoe) aoe(b.x, b.y, b.aoe, play, now);
          if (b.chain && b.chain > 0) {
            let n = b.chain, cx = e.x, cy = e.y;
            const hit = new Set<Enemy>([e]);
            while (n-- > 0) {
              let nx: Enemy | null = null, nd = 140 * 140;
              for (const o of enemies) {
                if (hit.has(o)) continue;
                const d = (o.x - cx) ** 2 + (o.y - cy) ** 2;
                if (d < nd) (nd = d), (nx = o);
              }
              if (!nx) break;
              bolts.push({ ax: cx, ay: cy, bx: nx.x, by: nx.y, life: 1 });
              nx.flash = 4;
              hit.add(nx);
              if ((nx.hp -= 1) <= 0) kill(nx, enemies.indexOf(nx), play, now);
              cx = nx.x;
              cy = nx.y;
            }
          }
          if ((b.pierce ?? 0) > 0) b.pierce!--;
          else {
            bullets.splice(i, 1);
            done = true;
          }
          break;
        }
      }
      if (done) continue;
    }

    // drops
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.y += d.vy;
      if (d.y > H + 20) {
        drops.splice(i, 1);
        continue;
      }
      if (play && !env.over.v && Math.abs(d.x - ship.x) < 20 && Math.abs(d.y - (ship.y - 12)) < 24) {
        collect(d, now, play);
        drops.splice(i, 1);
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.life -= 0.028;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].y -= 0.6; pops[i].life -= 0.02;
      if (pops[i].life <= 0) pops.splice(i, 1);
    }
    for (let i = bolts.length - 1; i >= 0; i--) {
      bolts[i].life -= 0.09;
      if (bolts[i].life <= 0) bolts.splice(i, 1);
    }

    /* ---- draw ---- */
    for (const e of enemies) {
      const sp = ISPEC[e.k];
      const w = sp.sprite[0].length * sp.sc;
      const h = sp.sprite.length * sp.sc;
      ctx.shadowColor = sp.col;
      ctx.shadowBlur = 6;
      px(ctx, sp.sprite, e.x - w / 2, e.y - h / 2, sp.sc, e.flash > 0 ? "#fff" : sp.col);
      if (e.k === "bulwark") {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#7dd3fc";
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(e.x, e.y + 4, w * 0.7, 0.15, Math.PI - 0.15);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.shadowBlur = 0;

    for (const m of mines) {
      const armed = now > m.arm;
      const p = armed ? 0.5 + 0.5 * Math.sin(now / 90) : 0.4;
      ctx.fillStyle = armed ? RED : "#6a819a";
      ctx.globalAlpha = p;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 5, 0, 6.283);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (!env.over.v || !play) drawShip();

    ctx.lineWidth = 2;
    for (const bl of bolts) {
      ctx.strokeStyle = "#7dd3fc";
      ctx.globalAlpha = bl.life;
      ctx.beginPath();
      ctx.moveTo(bl.ax, bl.ay);
      ctx.lineTo(bl.bx, bl.by);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const gc = play ? GSPEC[gun].col : C.bullet;
    for (const b of bullets) {
      ctx.fillStyle = b.foe ? RED : b.homing ? "#a78bfa" : b.chain ? "#7dd3fc" : b.rail ? "#fff" : b.aoe ? "#ff8fb3" : b.pierce ? RED : gc;
      ctx.shadowColor = ctx.fillStyle as string;
      ctx.shadowBlur = 6;
      const len = b.rail ? 26 : b.foe ? 6 : b.pierce ? 16 : 9;
      const wd = b.rail ? 3 : b.pierce ? 2 : 3;
      ctx.fillRect(b.x - wd / 2, b.y - len / 2, wd, len);
    }
    ctx.shadowBlur = 0;

    for (const d of drops) {
      const dc = puCol(d.t);
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = dc;
      ctx.shadowColor = dc;
      ctx.shadowBlur = 8;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
      ctx.fillStyle = "#03060c";
      ctx.font = "bold 10px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(puCh(d.t), d.x, d.y + 3.5);
    }
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";

    for (const s of sparks) {
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
    for (const p of pops) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.font = "bold 12px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.s, p.x, p.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";

    ctx.font = "12px ui-monospace, monospace";
    if (play) {
      ctx.fillStyle = C.hud;
      ctx.fillText(`SCORE ${String(score).padStart(6, "0")}`, 18, 28);
      ctx.fillText(`WAVE ${wave}`, 18, 46);
      ctx.fillStyle = GSPEC[gun].col;
      ctx.fillText(`GUN  ${GSPEC[gun].label}${now < rapidUntil ? "  +RAPID" : ""}`, 18, 64);
      for (let i = 0; i < lives; i++) px(ctx, SHIP, W - 34 - i * 20, 14, 1.1, C.ship);
      if (shieldHp > 0) {
        ctx.fillStyle = IPU.shield.col;
        ctx.fillText(`SHIELD x${shieldHp}`, 18, 82);
      }
      if (now - banner < 1400 && !env.over.v) {
        ctx.globalAlpha = 1 - (now - banner) / 1400;
        ctx.fillStyle = C.hud;
        ctx.font = "700 34px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText(wave === 1 ? "LAUNCH" : `WAVE ${wave}`, W / 2, H / 2 - 40);
        ctx.globalAlpha = 1;
        ctx.textAlign = "left";
        ctx.font = "12px ui-monospace, monospace";
      }
    } else {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = C.hud;
      ctx.fillText(`ALIENS NEUTRALIZED: ${String(score).padStart(4, "0")}`, 14, 22);
      ctx.globalAlpha = 1;
    }

    if (flashA > 0.01) {
      ctx.fillStyle = `rgba(255,255,255,${flashA})`;
      ctx.fillRect(-60, -60, W + 120, H + 120);
      flashA *= 0.86;
    }

    if (play && env.over.v)
      deathScreen(ctx, W, H, `SCORE ${String(score).padStart(6, "0")}   ·   WAVE ${wave}`,
        "CLICK / SPACE — RETRY        ESC — EXIT", C);
  };

  return { reset, step: render };
}

/* ================================================================ BREAKOUT */

type BPU =
  | "wide" | "multi" | "slow" | "laser" | "shock"
  | "catch" | "pierce" | "floor" | "life" | "bomb";
// weighted pool — laser is deliberately rare
const BPU_POOL: BPU[] = [
  "wide", "wide", "wide",
  "multi", "multi", "multi",
  "slow", "slow", "slow",
  "shock", "shock", "shock",
  "catch", "catch",
  "pierce", "pierce",
  "floor", "floor",
  "bomb", "bomb",
  "laser",
];
const BPU_SPEC: Record<BPU, { ch: string; col: string; label: string }> = {
  wide: { ch: "W", col: "#38bdf8", label: "WIDE ARRAY" },
  multi: { ch: "M", col: "#7dd3fc", label: "MULTI-BALL" },
  slow: { ch: "S", col: "#39ff9e", label: "TIME DILATION" },
  laser: { ch: "L", col: "#ffb648", label: "PADDLE LASER" },
  shock: { ch: "O", col: "#ffb648", label: "SHOCK ROUND" },
  catch: { ch: "C", col: "#a78bfa", label: "MAG-CLAMP" },
  pierce: { ch: "P", col: RED, label: "PHASE ROUND" },
  floor: { ch: "F", col: "#39ff9e", label: "TRACTOR FLOOR" },
  life: { ch: "+", col: "#ff8fb3", label: "SPARE HULL" },
  bomb: { ch: "X", col: "#ffffff", label: "DEMO CHARGE" },
};

type BKind = "n" | "s" | "x" | "m" | "h" | "mv" | "rg";
interface Brick {
  x: number; y: number; w: number; h: number;
  hp: number; max: number; kind: BKind; vx?: number; hit?: number;
}
interface Ball { x: number; y: number; vx: number; vy: number; stuck: boolean }
interface BDrop { x: number; y: number; vy: number; t: BPU }

const BRICK_COL = ["#38bdf8", "#7dd3fc", "#39ff9e", "#ffb648", "#ff8fb3", "#a78bfa"];

// field structures — one per wave, cycling. `keep` picks which cells get a brick.
type KeepFn = (r: number, c: number, R: number, Cn: number) => boolean;
const STRUCTURES: { name: string; keep: KeepFn }[] = [
  { name: "GRID", keep: () => Math.random() > 0.05 },
  { name: "PYRAMID", keep: (r, c, R, Cn) => Math.abs(c - Cn / 2 + 0.5) <= R - 1 - r + 0.5 },
  { name: "DIAMOND", keep: (r, c, R, Cn) => Math.abs(c - Cn / 2 + 0.5) / (Cn / 2) + Math.abs(r - R / 2 + 0.5) / (R / 2) <= 1.06 },
  { name: "COLUMNS", keep: (_r, c) => c % 3 !== 2 && Math.random() > 0.04 },
  { name: "CHECKER", keep: (r, c) => (r + c) % 2 === 0 },
  { name: "FORTRESS", keep: () => true },
  { name: "TUNNEL", keep: (_r, c, _R, Cn) => Math.abs(c - Cn / 2 + 0.5) > 1.7 },
  { name: "ARCH", keep: (r, c, _R, Cn) => Math.abs(c - Cn / 2 + 0.5) <= Math.max(1.6, Cn / 2 - r * 0.7) },
  { name: "STAIRCASE", keep: (r, c, _R, Cn) => { const s = (r * 2) % Cn; return c >= s && c < s + Math.max(3, Cn - 6); } },
  { name: "SCATTER", keep: () => Math.random() > 0.46 },
  { name: "RINGS", keep: (r, c, R, Cn) => { const d = Math.hypot((c - Cn / 2 + 0.5) / (Cn / 2), (r - R / 2 + 0.5) / (R / 2)); return ((d * 4) | 0) % 2 === 0; } },
  { name: "ZIGZAG", keep: (r, c, _R, Cn) => Math.abs(((c + r * 3) % (Cn * 2)) - Cn) < Cn * 0.55 },
  { name: "TOWERS", keep: (r, c, R) => c % 4 < 2 && (c % 4 === 0 ? true : r < R - 2) },
];

export function createBreakout(env: GameEnv): SpaceGame {
  const { ctx, C } = env;

  const PAD_W = 108;
  let pad = { x: 0, w: PAD_W };
  let balls: Ball[] = [];
  let bricks: Brick[] = [];
  let drops: BDrop[] = [];
  let lasers: { x: number; y: number }[] = [];
  let sparks: Spark[] = [];
  let pops: Pop[] = [];
  let score = 0;
  let wave = 1;
  let lives = 3;
  let combo = 1;
  let shake = 0;
  let banner = 0;
  let structName = "GRID";
  let leftX = 4;
  let rightX = 0;
  let lastBreach = 0;
  let lastLaser = 0;
  let wideUntil = 0, slowUntil = 0, laserUntil = 0, shockUntil = 0, catchUntil = 0, pierceUntil = 0;
  let floorCharges = 0;

  const padY = () => env.size().H - 40;
  const baseSpeed = () => 6.4 + wave * 0.55;
  const padWidth = (now: number) =>
    PAD_W * (now < wideUntil ? 1.5 : 1) * (1 - Math.min(0.3, (wave - 1) * 0.035));

  const build = () => {
    const { W } = env.size();
    bricks = [];
    // short bricks, but the field spans the FULL width — no side channel for the ball
    const Cn = Math.max(16, Math.min(40, Math.round(W / 34)));
    const bw = W / Cn;
    const bh = 15;
    const ox = 0;
    leftX = bw;
    rightX = W - bw;
    const R = Math.min(4 + wave, 13);
    const S = STRUCTURES[(wave - 1) % STRUCTURES.length];
    structName = S.name;
    for (let r = 0; r < R; r++)
      for (let c = 0; c < Cn; c++) {
        // edge columns are always filled — the ball can't sneak up the sides
        const edge = c === 0 || c === Cn - 1;
        const border = S.name === "FORTRESS" && (r === 0 || edge);
        if (!edge && !border && !S.keep(r, c, R, Cn)) continue;
        let kind: BKind = "n";
        const rr = Math.random();
        if (border) kind = "s";
        else if (edge && wave >= 3 && rr < 0.4) kind = "h";
        else if (wave >= 2 && rr < 0.05 + wave * 0.008) kind = "s";
        else if (rr < 0.13) kind = "x";
        else if (rr < 0.18) kind = "m";
        else if (wave >= 2 && rr < 0.28) kind = "h";
        else if (wave >= 3 && rr < 0.34 && (S.name === "SCATTER" || S.name === "GRID" || S.name === "CHECKER")) kind = "mv";
        else if (wave >= 4 && rr < 0.39) kind = "rg";
        let hp = 1;
        if (kind === "n") hp = 1 + (r < 2 ? 1 : 0) + (wave >= 3 && Math.random() < 0.35 ? 1 : 0);
        else if (kind === "h") hp = 3 + Math.min(4, wave >> 1);
        else if (kind === "rg") hp = 2;
        else if (kind === "s") hp = Infinity;
        const b: Brick = {
          x: ox + c * bw + 1.5, y: 82 + r * (bh + 4), w: bw - 3, h: bh,
          hp, max: hp === Infinity ? 1 : hp, kind,
        };
        if (kind === "mv") b.vx = (Math.random() < 0.5 ? -1 : 1) * (0.5 + wave * 0.06);
        bricks.push(b);
      }
  };

  const spawnBall = (stuck: boolean): Ball => {
    const { W } = env.size();
    return { x: stuck ? pad.x : W / 2, y: padY() - 14, vx: (Math.random() - 0.5) * 3.4, vy: -baseSpeed(), stuck };
  };

  const reset = () => {
    const { W } = env.size();
    pad = { x: W / 2, w: PAD_W };
    balls = [spawnBall(true)];
    drops = [];
    lasers = [];
    sparks = [];
    pops = [];
    score = 0;
    wave = 1;
    lives = 3;
    combo = 1;
    shake = 0;
    wideUntil = slowUntil = laserUntil = shockUntil = catchUntil = pierceUntil = 0;
    floorCharges = 0;
    lastBreach = 0;
    banner = performance.now();
    env.over.v = false;
    build();
  };

  const boom = (x: number, y: number, c: string, n = 12) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283;
      const s = 0.6 + Math.random() * 2.4;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c });
    }
  };
  const pop = (x: number, y: number, s: string, c: string) => pops.push({ x, y, s, life: 1, c });

  const damage = (b: Brick, amt: number, now: number) => {
    if (b.kind === "s" || b.hp <= 0) return;
    b.hit = now;
    b.hp -= b.kind === "h" ? 1 : amt;
    if (b.hp <= 0) breakBrick(b, now);
    else boom(b.x + b.w / 2, b.y + b.h / 2, "#cfe4ff", 3);
  };

  const breakBrick = (b: Brick, now: number) => {
    b.hp = 0;
    score += 15 * combo;
    combo = Math.min(9, combo + 1);
    boom(b.x + b.w / 2, b.y + b.h / 2, BRICK_COL[Math.min(b.max, 5)]);
    if (b.kind === "x") {
      shake = Math.max(shake, 11);
      boom(b.x + b.w / 2, b.y + b.h / 2, "#ffb648", 22);
      for (const o of bricks) {
        if (o === b || o.hp <= 0 || o.kind === "s") continue;
        if (Math.abs(o.x - b.x) < b.w * 2 && Math.abs(o.y - b.y) < (b.h + 4) * 2) {
          if (o.kind === "x") o.hp = 0.001;
          damage(o, 3, now);
        }
      }
    }
    const chance = b.kind === "m" ? 1 : b.kind === "h" ? 0.3 : 0.16;
    if (Math.random() < chance) {
      const t: BPU = Math.random() < 0.05 ? "life" : BPU_POOL[(Math.random() * BPU_POOL.length) | 0];
      drops.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, vy: 1.6, t });
    }
  };

  const apply = (t: BPU, now: number) => {
    pop(pad.x, padY() - 22, BPU_SPEC[t].label, BPU_SPEC[t].col);
    if (t === "wide") wideUntil = now + 11000;
    else if (t === "slow") slowUntil = now + 8000;
    else if (t === "laser") laserUntil = now + 9000;
    else if (t === "shock") shockUntil = now + 8000;
    else if (t === "catch") catchUntil = now + 10000;
    else if (t === "pierce") pierceUntil = now + 5000;
    else if (t === "floor") floorCharges = Math.min(3, floorCharges + 1);
    else if (t === "life") lives = Math.min(6, lives + 1);
    else if (t === "multi") {
      const src = balls.filter((b) => !b.stuck).slice(0, 3);
      for (const b of src)
        for (const da of [-0.5, 0.5]) {
          const sp = Math.hypot(b.vx, b.vy) || 6;
          const an = Math.atan2(b.vy, b.vx) + da;
          balls.push({ x: b.x, y: b.y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, stuck: false });
        }
      if (!src.length) balls.push(spawnBall(false));
    } else if (t === "bomb") {
      shake = Math.max(shake, 14);
      const live = bricks.filter((b) => b.hp > 0 && b.kind !== "s").sort((a, z) => z.y - a.y);
      for (const b of live.slice(0, 20)) breakBrick(b, now);
    }
  };

  const render = (now: number) => {
    const { W, H } = env.size();
    const py = padY();
    const slow = now < slowUntil ? 0.74 : 1;

    if (shake > 0.3) {
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      shake *= 0.86;
    }
    ctx.clearRect(-60, -60, W + 120, H + 120);

    pad.w = padWidth(now);
    pad.x += (env.input.x - pad.x) * 0.4;
    pad.x = Math.max(pad.w / 2, Math.min(W - pad.w / 2, pad.x));

    const click = env.input.clicked;
    env.input.clicked = false;

    if (!env.over.v) {
      if (click) for (const b of balls) if (b.stuck) { b.stuck = false; b.vy = -baseSpeed(); b.vx = (Math.random() - 0.5) * 3.4; }

      if (now < laserUntil && now - lastLaser > 240) {
        lastLaser = now;
        lasers.push({ x: pad.x - pad.w / 2 + 6, y: py - 8 }, { x: pad.x + pad.w / 2 - 6, y: py - 8 });
      }

      // field creep + moving / regen bricks
      const cs = 0.012 + wave * 0.006;
      for (const br of bricks) {
        if (br.hp <= 0) continue;
        br.y += cs;
        if (br.kind === "mv" && br.vx) {
          br.x += br.vx;
          if (br.x < leftX) { br.x = leftX; br.vx = Math.abs(br.vx); }
          if (br.x + br.w > rightX) { br.x = rightX - br.w; br.vx = -Math.abs(br.vx); }
        }
        if (br.kind === "rg" && br.hp < br.max && now - (br.hit ?? 0) > 3800) {
          br.hp = br.max;
          boom(br.x + br.w / 2, br.y + br.h / 2, "#7dd3fc", 6);
        }
        if (br.kind !== "s" && br.y + br.h > py - 22 && now - lastBreach > 1100) {
          lastBreach = now;
          br.hp = 0;
          shake = Math.max(shake, 16);
          boom(br.x + br.w / 2, br.y + br.h / 2, RED, 18);
          pop(W / 2, py - 60, "HULL BREACH", RED);
          if (--lives <= 0) env.over.v = true;
        }
      }

      // balls
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        if (b.stuck) { b.x = pad.x; b.y = py - 14; continue; }
        b.x += b.vx * slow;
        b.y += b.vy * slow;
        if (b.x < 6) { b.x = 6; b.vx = Math.abs(b.vx); }
        if (b.x > W - 6) { b.x = W - 6; b.vx = -Math.abs(b.vx); }
        if (b.y < 6) { b.y = 6; b.vy = Math.abs(b.vy); }

        if (b.vy > 0 && b.y > py - 12 && b.y < py + 10 && Math.abs(b.x - pad.x) < pad.w / 2 + 6) {
          if (now < catchUntil) { b.stuck = true; b.vy = 0; }
          else {
            const hit = Math.max(-1, Math.min(1, (b.x - pad.x) / (pad.w / 2)));
            const sp = Math.min(16, Math.max(baseSpeed() * 1.02, Math.hypot(b.vx, b.vy) + 0.2));
            const ang = hit * 1.18;
            b.vx = Math.sin(ang) * sp;
            b.vy = -Math.abs(Math.cos(ang) * sp);
            b.y = py - 13;
            combo = 1;
          }
        }

        if (b.y > H - 4) {
          if (floorCharges > 0) { floorCharges--; b.vy = -Math.abs(b.vy); b.y = H - 8; pop(b.x, b.y - 14, "FLOOR", "#39ff9e"); }
          else if (b.y > H + 14) balls.splice(i, 1);
          continue;
        }

        const pierce = now < pierceUntil;
        for (const br of bricks) {
          if (br.hp <= 0) continue;
          if (b.x > br.x - 5 && b.x < br.x + br.w + 5 && b.y > br.y - 5 && b.y < br.y + br.h + 5) {
            if (!pierce || br.kind === "s") {
              const pen = Math.min(b.x - br.x, br.x + br.w - b.x) - Math.min(b.y - br.y, br.y + br.h - b.y);
              if (pen < 0) b.vx = -b.vx;
              else b.vy = -b.vy;
            }
            if (br.kind === "s") boom(b.x, b.y, "#6a819a", 4);
            else {
              damage(br, pierce ? 3 : 1, now);
              if (now < shockUntil) {
                for (const o of bricks) {
                  if (o === br || o.hp <= 0 || o.kind === "s") continue;
                  if (Math.abs(o.x - br.x) < br.w * 1.4 && Math.abs(o.y - br.y) < (br.h + 4) * 1.4) damage(o, 1, now);
                }
                boom(b.x, b.y, "#ffb648", 6);
              }
            }
            if (!pierce) break;
          }
        }
      }

      if (balls.length === 0 && !env.over.v) {
        if (--lives <= 0) env.over.v = true;
        else balls.push(spawnBall(true));
      }

      // lasers
      for (let i = lasers.length - 1; i >= 0; i--) {
        const L = lasers[i];
        L.y -= 10;
        if (L.y < -10) { lasers.splice(i, 1); continue; }
        for (const br of bricks) {
          if (br.hp <= 0 || br.kind === "s") continue;
          if (L.x > br.x && L.x < br.x + br.w && L.y < br.y + br.h && L.y > br.y - 4) {
            damage(br, 1, now);
            lasers.splice(i, 1);
            break;
          }
        }
      }

      // drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy;
        if (d.y > H + 20) { drops.splice(i, 1); continue; }
        if (d.y > py - 16 && d.y < py + 12 && Math.abs(d.x - pad.x) < pad.w / 2 + 8) {
          apply(d.t, now);
          drops.splice(i, 1);
        }
      }

      if (bricks.length && bricks.every((b) => b.hp <= 0 || b.kind === "s")) {
        wave++;
        combo = 1;
        banner = now;
        build();
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.life -= 0.03;
      if (s.life <= 0) sparks.splice(i, 1);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].y -= 0.5; pops[i].life -= 0.02;
      if (pops[i].life <= 0) pops.splice(i, 1);
    }

    /* ---- draw ---- */
    for (const br of bricks) {
      if (br.hp <= 0) continue;
      let col: string;
      if (br.kind === "s") col = "#6a819a";
      else if (br.kind === "x") col = "#ffb648";
      else if (br.kind === "m") col = "#a78bfa";
      else if (br.kind === "h") col = "#94a3b8";
      else if (br.kind === "rg") col = "#7dd3fc";
      else col = BRICK_COL[Math.min(br.hp, 5)];
      ctx.fillStyle = col;
      ctx.globalAlpha = br.kind === "s" ? 0.5 : 1;
      ctx.shadowColor = col;
      ctx.shadowBlur = br.kind === "rg" ? 4 + 3 * Math.sin(now / 200) : 5;
      ctx.fillRect(br.x, br.y, br.w, br.h);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#03060c";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(br.x, br.y, br.w, br.h);
      const cx = br.x + br.w / 2;
      const cy = br.y + br.h / 2 + 3.5;
      ctx.fillStyle = "#03060c";
      ctx.font = "bold 10px ui-monospace, monospace";
      ctx.textAlign = "center";
      if (br.kind === "x") ctx.fillText("✸", cx, cy);
      else if (br.kind === "m") ctx.fillText("?", cx, cy);
      else if (br.kind === "mv") ctx.fillText(br.vx && br.vx > 0 ? "»" : "«", cx, cy);
      else if (br.kind === "rg") ctx.fillText("~", cx, cy);
      else if (br.hp > 1) ctx.fillText(String(br.hp), cx, cy);
      ctx.textAlign = "left";
    }

    // paddle
    ctx.fillStyle = C.cockpit;
    ctx.shadowColor = C.cockpit;
    ctx.shadowBlur = 12;
    ctx.fillRect(pad.x - pad.w / 2, py, pad.w, 9);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#03060c";
    ctx.fillRect(pad.x - 3, py + 2, 6, 5);
    if (now < laserUntil) {
      ctx.fillStyle = "#ffb648";
      ctx.fillRect(pad.x - pad.w / 2 + 3, py - 5, 4, 5);
      ctx.fillRect(pad.x + pad.w / 2 - 7, py - 5, 4, 5);
    }
    if (floorCharges > 0) {
      ctx.strokeStyle = "#39ff9e";
      ctx.globalAlpha = 0.35 + 0.2 * Math.sin(now / 200);
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, H - 3);
      ctx.lineTo(W, H - 3);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    for (const L of lasers) {
      ctx.fillStyle = "#ffb648";
      ctx.shadowColor = "#ffb648";
      ctx.shadowBlur = 6;
      ctx.fillRect(L.x - 1.5, L.y - 8, 3, 11);
    }
    ctx.shadowBlur = 0;

    for (const b of balls) {
      ctx.fillStyle = now < pierceUntil ? RED : now < shockUntil ? "#ffb648" : "#cfe4ff";
      ctx.shadowColor = ctx.fillStyle as string;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 5, 0, 6.283);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    for (const d of drops) {
      const dc = BPU_SPEC[d.t].col;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = dc;
      ctx.shadowColor = dc;
      ctx.shadowBlur = 8;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.restore();
      ctx.fillStyle = "#03060c";
      ctx.font = "bold 10px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(BPU_SPEC[d.t].ch, d.x, d.y + 3.5);
      ctx.textAlign = "left";
    }
    ctx.shadowBlur = 0;

    for (const s of sparks) {
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
    for (const p of pops) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.font = "bold 12px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(p.s, p.x, p.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";

    ctx.font = "12px ui-monospace, monospace";
    ctx.fillStyle = C.hud;
    ctx.fillText(`SCORE ${String(score).padStart(6, "0")}`, 18, 28);
    ctx.fillText(`WAVE ${wave}  ·  ${structName}  ·  COMBO x${combo}`, 18, 46);
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = C.ship;
      ctx.fillRect(W - 30 - i * 16, 16, 10, 5);
    }
    const chips: string[] = [];
    if (now < wideUntil) chips.push("WIDE");
    if (now < slowUntil) chips.push("SLOW");
    if (now < laserUntil) chips.push("LASER");
    if (now < shockUntil) chips.push("SHOCK");
    if (now < catchUntil) chips.push("CATCH");
    if (now < pierceUntil) chips.push("PHASE");
    if (floorCharges) chips.push(`FLOOR x${floorCharges}`);
    if (chips.length) {
      ctx.fillStyle = C.dim;
      ctx.fillText(chips.join("  ·  "), 18, 64);
    }

    if (now - banner < 1500 && !env.over.v) {
      ctx.globalAlpha = 1 - (now - banner) / 1500;
      ctx.fillStyle = C.hud;
      ctx.font = "700 30px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(wave === 1 ? "DEPLOY" : `WAVE ${wave} — ${structName}`, W / 2, H / 2 - 40);
      ctx.globalAlpha = 1;
      ctx.textAlign = "left";
    }

    if (env.over.v)
      deathScreen(ctx, W, H, `SCORE ${String(score).padStart(6, "0")}   ·   WAVE ${wave}`,
        "CLICK / SPACE — RETRY        ESC — EXIT", C);
  };

  return { reset, step: render };
}

