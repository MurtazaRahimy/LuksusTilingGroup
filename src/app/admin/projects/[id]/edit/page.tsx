import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import ProjectForm from "@/components/ProjectForm";
import GalleryManager from "@/components/GalleryManager";
import { updateProject } from "@/app/admin/actions";

export const metadata = { title: "Edit Project", robots: { index: false, follow: false } };

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ created?: string; saved?: string }>;

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { created, saved } = await searchParams;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, id);

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-heading font-bold text-2xl text-primary mb-2">Edit Project</h1>
        {(created === "1" || saved === "1") && (
          <p className="bg-white border border-border rounded px-4 py-3 text-sm text-ink/80 mb-6">
            {created === "1" ? "Project created." : "Changes saved."} Add gallery photos below.
          </p>
        )}

        <div className="bg-white border border-border rounded-md p-6 mb-8">
          <ProjectForm
            action={boundUpdate}
            submitLabel="Save Changes"
            initialValues={{
              title: project.title,
              suburb: project.suburb,
              type: project.type,
              summary: project.summary,
              description: project.description,
              scope: project.scope,
              materials: project.materials,
              duration: project.duration,
              clientQuote: project.clientQuote ?? "",
              featured: project.featured,
              published: project.published,
              coverImage: project.coverImage,
            }}
          />
        </div>

        <div className="bg-white border border-border rounded-md p-6">
          <GalleryManager projectId={project.id} images={project.images} />
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
