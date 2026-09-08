/** Single source for router + nav menu. `file` is the retro DOS-style label. */
export interface RouteDef {
  path: string;
  label: string;
  file: string;
}

export const routes: RouteDef[] = [
  { path: "/", label: "About", file: "ABOUT_ME.TXT" },
  { path: "/experience", label: "Work", file: "WORK.LOG" },
  { path: "/projects", label: "Projects", file: "PROJECTS/" },
  { path: "/skills", label: "Skills", file: "SKILLS.DAT" },
  { path: "/education", label: "School", file: "SCHOOL.SYS" },
  { path: "/achievements", label: "Wins", file: "WINS.BAK" },
  { path: "/resume", label: "Resume", file: "RESUME.DOC" },
  { path: "/blog", label: "Blog", file: "BLOG/" },
  { path: "/contact", label: "Contact", file: "CONTACT.MSG" },
];
