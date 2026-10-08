import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serviceLabel } from "@/lib/site";
import Gallery from "@/components/Gallery";

type Params = Promise<{ slug: string }>;

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.suburb}`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || !project.published) notFound();

  const galleryImages = [
    { url: project.coverImage, alt: project.coverAlt, tag: "NONE" as const },
    ...project.images.map((img) => ({ url: img.url, alt: img.alt, tag: img.tag })),
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <Link href="/projects" className="text-sm text-accent font-semibold hover:underline">
        ← All projects
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded">
          {serviceLabel(project.type)}
        </span>
        <span className="text-ink/60 text-sm">{project.suburb}</span>
      </div>

      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-primary mt-3 text-balance">{project.title}</h1>
      <p className="text-ink/75 mt-3 max-w-2xl">{project.summary}</p>

      <div className="mt-8">
        <Gallery images={galleryImages} />
      </div>

      <div className="mt-12 grid gap-10 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h2 className="font-heading font-semibold text-xl text-primary mb-3">About this job</h2>
          <p className="text-ink/85 leading-relaxed">{project.description}</p>

          {project.clientQuote && (
            <blockquote className="mt-6 border-l-4 border-accent pl-4 italic text-ink/80">
              &ldquo;{project.clientQuote}&rdquo;
            </blockquote>
          )}
        </div>

        <div className="bg-muted rounded-md p-6">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-primary">Scope of work</dt>
              <dd className="text-ink/80 mt-1">{project.scope}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Materials</dt>
              <dd className="text-ink/80 mt-1">{project.materials}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Duration</dt>
              <dd className="text-ink/80 mt-1">{project.duration}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Location</dt>
              <dd className="text-ink/80 mt-1">{project.suburb}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-12 bg-primary text-white rounded-md p-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-heading font-semibold text-xl">Want something similar?</p>
        <Link href="/contact" className="bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90">
          Get a Quote
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
