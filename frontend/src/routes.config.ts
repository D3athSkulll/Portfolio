/** Single source for router + nav.
 *  `file`  — retro/vim DOS-style label (e.g. WORK.LOG)
 *  `space` — SPACE-theme mission-control label (e.g. FLIGHT.LOG)
 *  `color` — neobrutalist accent used when a route is active/hovered. */
export interface RouteDef {
  path: string;
  label: string;
  file: string;
  space: string;
  color: string;
}

export const routes: RouteDef[] = [
  { path: "/", label: "About", file: "ABOUT_ME.TXT", space: "CREW.BIO", color: "#ff8a1e" },
  { path: "/experience", label: "Work", file: "WORK.LOG", space: "FLIGHT.LOG", color: "#ff3b1f" },
  { path: "/projects", label: "Projects", file: "PROJECTS/", space: "PAYLOAD.MANIFEST", color: "#e11d74" },
  { path: "/collaborations", label: "Collabs", file: "COLLABS/", space: "JOINT-OPS.LOG", color: "#0ea5e9" },
  { path: "/skills", label: "Skills", file: "SKILLS.DAT", space: "SYS.DIAG", color: "#7c3aed" },
  { path: "/designs", label: "Designs", file: "DESIGNS/", space: "OPTICS.ARRAY", color: "#2563eb" },
  { path: "/education", label: "School", file: "SCHOOL.SYS", space: "TRAINING.REC", color: "#0891b2" },
  { path: "/test-scores", label: "Test Scores", file: "SCORES.DAT", space: "EXAM.TELEMETRY", color: "#db2777" },
  { path: "/extracurricular", label: "POR", file: "POR.LOG", space: "COMMAND.ROSTER", color: "#15803d" },
  { path: "/wins", label: "Wins", file: "WINS.BAK", space: "MISSION.AWARDS", color: "#ca8a04" },
  { path: "/likes", label: "Likes", file: "LIKES.CFG", space: "OFF-DUTY.LOG", color: "#4f46e5" },
  { path: "/resume", label: "Resume", file: "RESUME.DOC", space: "DOSSIER.PDF", color: "#c2410c" },
  { path: "/blog", label: "Blog", file: "BLOG/", space: "TRANSMISSION.LOG", color: "#0d9488" },
  { path: "/contact", label: "Contact", file: "CONTACT.MSG", space: "COMMS.UPLINK", color: "#9333ea" },
];
