import { useQuery } from "@tanstack/react-query";
import type { BlogIndexEntry, BlogPost, Profile } from "./types";

// On static hosts (Vercel) the data files are served as plain assets; with the
// Axum backend they come from /api/*. Toggled by VITE_STATIC_DATA at build time.
const STATIC = import.meta.env.VITE_STATIC_DATA === "true";
const PROFILE_URL = STATIC ? "/profile.json" : "/api/profile";
const BLOG_INDEX_URL = STATIC ? "/blog-index.json" : "/api/blog";
const blogPostUrl = (slug: string) => (STATIC ? `/blog/${slug}.json` : `/api/blog/${slug}`);

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const useProfile = () =>
  useQuery({ queryKey: ["profile"], queryFn: () => get<Profile>(PROFILE_URL) });

export const useBlogIndex = () =>
  useQuery({ queryKey: ["blog"], queryFn: () => get<BlogIndexEntry[]>(BLOG_INDEX_URL) });

export const useBlogPost = (slug: string) =>
  useQuery({
    queryKey: ["blog", slug],
    queryFn: () => get<BlogPost>(blogPostUrl(slug)),
  });
