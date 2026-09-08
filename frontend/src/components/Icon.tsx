import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  Code2,
  Gitlab,
  FileText,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  envelope: Mail,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  code: Code2,
  gitlab: Gitlab,
  "google-drive": FileText,
};

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const C = MAP[name] ?? ExternalLink;
  return <C size={size} strokeWidth={1.75} aria-hidden />;
}

export function IconLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label ?? icon}
      className="inline-flex items-center gap-1.5 rounded-sm border-2 border-transparent px-1.5 py-0.5 font-body text-[13px] font-bold no-underline transition-colors retro:!text-[#164cc4] retro:hover:border-[#0b0810] retro:hover:bg-white vim:hover:border-line"
    >
      <Icon name={icon} size={16} />
      {label && <span>{label}</span>}
    </a>
  );
}
