// Profile shapes are generated from the Rust model — run
//   cd backend && TS_RS_EXPORT_DIR=../frontend/src/types cargo test export_bindings
export type {
  Profile,
  Person,
  Link,
  Entry,
  Education,
  SkillGroup,
  Position,
  Design,
  Resume,
  ResumeVariant,
  SourceLink,
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
  /** Full post HTML (every page concatenated) — SEO / no-JS fallback. */
  html: string;
  /** Rendered HTML per page, split on page-break markers. Always length >= 1. */
  pages: string[];
  pageCount: number;
  toc: { level: number; text: string; id: string }[];
  readingMinutes: number;
}
