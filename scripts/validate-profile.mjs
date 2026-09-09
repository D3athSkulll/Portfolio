#!/usr/bin/env node
// Minimal dependency-free validator for profile.json.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (cond, msg) => { if (!cond) errors.push(msg); };

let data;
try {
  data = JSON.parse(readFileSync(join(root, "profile.json"), "utf8"));
} catch (e) {
  console.error("profile.json: invalid JSON —", e.message);
  process.exit(1);
}

const isStr = (v) => typeof v === "string" && v.length > 0;
const isArr = (v) => Array.isArray(v);
const ym = /^\d{4}-\d{2}$/;

ok(data.meta && isStr(data.meta.siteTitle), "meta.siteTitle must be a non-empty string");
ok(data.meta && isStr(data.meta.tagline), "meta.tagline must be a non-empty string");
ok(data.meta && Number.isInteger(data.meta.visitorCountSeed), "meta.visitorCountSeed must be an integer");
ok(data.meta && /^\d{4}-\d{2}-\d{2}$/.test(data.meta.y2kCountdownTarget ?? ""), "meta.y2kCountdownTarget must be YYYY-MM-DD");

ok(data.profile && isStr(data.profile.name), "profile.name required");
ok(data.profile && isStr(data.profile.role), "profile.role required");
ok(data.profile && isStr(data.profile.summary), "profile.summary required");
ok(data.profile && isArr(data.profile.contact) && data.profile.contact.length > 0, "profile.contact must be a non-empty array");
for (const [i, c] of (data.profile?.contact ?? []).entries()) {
  ok(isStr(c.label) && isStr(c.href) && isStr(c.icon), `profile.contact[${i}] needs label, href, icon`);
}

for (const [i, e] of (data.education ?? []).entries()) {
  ok(isStr(e.institution) && isStr(e.degree), `education[${i}] needs institution and degree`);
  ok(ym.test(e.from) && ym.test(e.to), `education[${i}] from/to must be YYYY-MM`);
}

for (const key of ["experience", "projects"]) {
  ok(isArr(data[key]) && data[key].length > 0, `${key} must be a non-empty array`);
  for (const [i, it] of (data[key] ?? []).entries()) {
    ok(isStr(it.title), `${key}[${i}].title required`);
    ok(ym.test(it.from) && ym.test(it.to), `${key}[${i}] from/to must be YYYY-MM`);
    ok(isArr(it.bullets) && it.bullets.every(isStr), `${key}[${i}].bullets must be strings`);
    ok(
      it.type === undefined ||
        it.type === null ||
        isStr(it.type) ||
        (isArr(it.type) && it.type.every(isStr)),
      `${key}[${i}].type must be a string or array of strings`,
    );
    for (const [j, l] of (it.links ?? []).entries()) {
      ok(isStr(l.href) && isStr(l.icon), `${key}[${i}].links[${j}] needs href and icon`);
    }
  }
}

ok(isArr(data.achievements) && data.achievements.every(isStr), "achievements must be an array of strings");
const isDropItem = (p) =>
  isStr(p) ||
  (p && isStr(p.title) && (p.bullets === undefined || (isArr(p.bullets) && p.bullets.every(isStr))));
for (const key of ["positions", "testScores", "likes"]) {
  if (key !== "positions" && data[key] === undefined) continue; // optional
  ok(
    isArr(data[key]) && data[key].every(isDropItem),
    `${key} must be an array of strings or { title, bullets[] } objects`,
  );
}

ok(isArr(data.skills) && data.skills.length > 0, "skills must be a non-empty array");
for (const [i, s] of (data.skills ?? []).entries()) {
  ok(isStr(s.category) && isArr(s.items) && s.items.every(isStr), `skills[${i}] needs category and string items`);
}

for (const [i, d] of (data.designs ?? []).entries()) {
  ok(isStr(d.title) && isStr(d.description), `designs[${i}] needs title and description`);
}

ok(data.resume && isArr(data.resume.downloads) && data.resume.downloads.length > 0, "resume.downloads must be a non-empty array");
for (const [i, r] of (data.resume?.downloads ?? []).entries()) {
  ok(isStr(r.role) && isStr(r.label) && isStr(r.href), `resume.downloads[${i}] needs role, label, href`);
}
if (data.resume?.source) {
  ok(isStr(data.resume.source.label) && isStr(data.resume.source.href), "resume.source needs label and href");
}

if (errors.length) {
  console.error("profile.json failed validation:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("profile.json OK");
