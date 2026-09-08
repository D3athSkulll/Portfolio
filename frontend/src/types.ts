// Profile shapes are generated from the Rust model — run
//   cd backend && TS_RS_EXPORT_DIR=../frontend/src/types cargo test export_bindings
export type {
  Profile,
  Person,
  Link,
  Entry,
  Education,
  SkillGroup,
  ResumeLink,
  Meta,
} from "./types/profile.gen";

// Blog shapes are produced by the `bloggen` binary (see backend/src/blog.rs).
export interface BlogIndexEntry {
  title: string;
  date: string;
  slug: string;
  summary: string;
  tags: string[];
  cover: string | null;
}

export interface BlogPost extends BlogIndexEntry {
  draft: boolean;
  html: string;
  toc: { level: number; text: string; id: string }[];
  readingMinutes: number;
}
