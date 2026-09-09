/** Single source for router + nav. `file` is the retro DOS-style label.
 *  `color` is the neobrutalist accent used when this route is active/hovered
 *  (side-menu item + the main window-frame shadow follow it). */
export interface RouteDef {
  path: string;
  label: string;
  file: string;
  color: string;
}

export const routes: RouteDef[] = [
  { path: "/", label: "About", file: "ABOUT_ME.TXT", color: "#ff8a1e" },
  { path: "/experience", label: "Work", file: "WORK.LOG", color: "#ff3b1f" },
  { path: "/projects", label: "Projects", file: "PROJECTS/", color: "#e11d74" },
  { path: "/collaborations", label: "Collabs", file: "COLLABS/", color: "#0ea5e9" },
  { path: "/skills", label: "Skills", file: "SKILLS.DAT", color: "#7c3aed" },
  { path: "/designs", label: "Designs", file: "DESIGNS/", color: "#2563eb" },
  { path: "/education", label: "School", file: "SCHOOL.SYS", color: "#0891b2" },
  { path: "/test-scores", label: "Scores", file: "SCORES.DAT", color: "#db2777" },
  { path: "/extracurricular", label: "POR", file: "POR.LOG", color: "#15803d" },
  { path: "/wins", label: "Wins", file: "WINS.BAK", color: "#ca8a04" },
  { path: "/likes", label: "Likes", file: "LIKES.CFG", color: "#4f46e5" },
  { path: "/resume", label: "Resume", file: "RESUME.DOC", color: "#c2410c" },
  { path: "/blog", label: "Blog", file: "BLOG/", color: "#0d9488" },
  { path: "/contact", label: "Contact", file: "CONTACT.MSG", color: "#9333ea" },
];
