import { useQuery } from "@tanstack/react-query";
import type { BlogIndexEntry, BlogPost, Profile } from "./types";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const useProfile = () =>
  useQuery({ queryKey: ["profile"], queryFn: () => get<Profile>("/api/profile") });

export const useBlogIndex = () =>
  useQuery({ queryKey: ["blog"], queryFn: () => get<BlogIndexEntry[]>("/api/blog") });

export const useBlogPost = (slug: string) =>
  useQuery({
    queryKey: ["blog", slug],
    queryFn: () => get<BlogPost>(`/api/blog/${slug}`),
  });
