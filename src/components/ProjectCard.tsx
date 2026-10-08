import Image from "next/image";
import Link from "next/link";
import { serviceLabel } from "@/lib/site";

export type ProjectCardData = {
  slug: string;
  title: string;
  suburb: string;
  type: string;
  summary: string;
  coverImage: string;
  coverAlt: string;
};

export default function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block bg-white border border-border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.coverAlt || `${project.title} in ${project.suburb}`}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded">
          {serviceLabel(project.type)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg text-primary">{project.title}</h3>
        <p className="text-sm text-ink/70 mt-1">{project.suburb}</p>
        <p className="text-sm text-ink/80 mt-2 line-clamp-2">{project.summary}</p>
      </div>
    </Link>
  );
}
