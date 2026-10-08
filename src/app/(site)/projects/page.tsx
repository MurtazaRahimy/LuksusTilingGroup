import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SERVICE_TYPES } from "@/lib/site";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse our recent tiling, screeding, stone and waterproofing projects across Melbourne's eastern suburbs.",
};

type SearchParams = Promise<{ type?: string }>;

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const { type } = await searchParams;
  const activeType = type && SERVICE_TYPES.some((s) => s.value === type) ? type : undefined;

  const projects = await prisma.project.findMany({
    where: {
      published: true,
      ...(activeType ? { type: activeType as never } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <h1 className="font-heading font-bold text-4xl text-primary text-balance">Projects</h1>
      <p className="text-ink/75 mt-3 max-w-xl">
        A look at our recent tiling, screeding, stone and waterproofing work across the eastern suburbs.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
        <FilterLink href="/projects" active={!activeType}>
          All
        </FilterLink>
        {SERVICE_TYPES.map((s) => (
          <FilterLink key={s.value} href={`/projects?type=${s.value}`} active={activeType === s.value}>
            {s.label}
          </FilterLink>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="mt-12 text-ink/60">No projects in this category yet — check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={{
                slug: p.slug,
                title: p.title,
                suburb: p.suburb,
                type: p.type,
                summary: p.summary,
                coverImage: p.coverImage,
                coverAlt: p.coverAlt,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`text-sm font-semibold px-4 py-2 rounded border transition-colors ${
        active
          ? "bg-accent text-white border-accent"
          : "bg-white text-ink border-border hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </Link>
  );
}
