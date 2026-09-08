import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Globe,
  Code2,
  GitlabIcon,
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
  gitlab: GitlabIcon,
  "google-drive": FileText,
};

export function Icon({ name, size = 15 }: { name: string; size?: number }) {
  const C = MAP[name] ?? ExternalLink;
  return <C size={size} strokeWidth={1.75} aria-hidden />;
}

/** A labelled outbound link with its icon. */
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
      className="iconlink"
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label ?? icon}
    >
      <Icon name={icon} />
      {label && <span>{label}</span>}
    </a>
  );
}
