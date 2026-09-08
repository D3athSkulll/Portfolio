export interface Link {
  label?: string;
  href: string;
  icon: string;
}

export interface Entry {
  title: string;
  subtitle?: string;
  from: string;
  to: string;
  location?: string;
  links?: Link[];
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  from: string;
  to: string;
  detail?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Profile {
  meta: {
    siteTitle: string;
    tagline: string;
    footerCredit: string;
    visitorCountSeed: number;
    y2kCountdownTarget: string;
  };
  profile: {
    name: string;
    role: string;
    location: string;
    summary: string;
    contact: Link[];
  };
  education: Education[];
  experience: Entry[];
  projects: Entry[];
  achievements: string[];
  positions: string[];
  skills: SkillGroup[];
  resume: { href: string; label: string };
}

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
