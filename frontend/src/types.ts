// Profile shapes are generated from the Rust model — run
//   cd backend && TS_RS_EXPORT_DIR=../frontend/src/types cargo test export_bindings
import type {
  Profile as GenProfile,
  Entry as GenEntry,
} from "./types/profile.gen";

export type {
  Person,
  Link,
  Education,
  SkillGroup,
  Position,
  Design,
  Resume,
  ResumeVariant,
  SourceLink,
  Meta,
} from "./types/profile.gen";

/**
 * Work / project entry. The JSON key is `type` and accepts a single string or an
 * array of category names (ts-rs emits it under the Rust field name `kind`,
 * which is why we re-shape it here). Use `catsOf()` from `pages.tsx` to read it.
 */
export type Entry = Omit<GenEntry, "kind"> & {
  type?: string | string[] | null;
};

export type Profile = Omit<GenProfile, "experience" | "projects"> & {
  experience: Entry[];
  projects: Entry[];
};

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
