import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serviceLabel } from "@/lib/site";
import AdminNav from "@/components/AdminNav";
import DeleteProjectButton from "@/components/DeleteProjectButton";

export const metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

type SearchParams = Promise<{ deleted?: string }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { deleted } = await searchParams;

  const [projects, newEnquiries] = await Promise.all([
    prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.enquiry.count({ where: { status: "new" } }),
  ]);

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-10">
        {deleted === "1" && (
          <p className="bg-white border border-border rounded px-4 py-3 text-sm text-ink/80 mb-6">
            Project deleted.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl text-primary">Projects</h1>
            <p className="text-sm text-ink/70 mt-1">
              {newEnquiries > 0 ? (
                <Link href="/admin/enquiries" className="text-accent font-semibold hover:underline">
                  {newEnquiries} new enquir{newEnquiries === 1 ? "y" : "ies"} waiting →
                </Link>
              ) : (
                "No new enquiries."
              )}
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="bg-accent text-white font-semibold px-5 py-2.5 rounded hover:opacity-90"
          >
            + Add Project
          </Link>
        </div>

        <div className="bg-white border border-border rounded-md divide-y divide-border">
          {projects.length === 0 && <p className="p-6 text-ink/60 text-sm">No projects yet.</p>}
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative w-20 h-14 flex-shrink-0 rounded overflow-hidden bg-muted">
                <Image src={p.coverImage} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary truncate">{p.title}</p>
                  {!p.published && (
                    <span className="text-xs font-semibold bg-ink/10 text-ink/70 px-2 py-0.5 rounded">Draft</span>
                  )}
                  {p.featured && (
                    <span className="text-xs font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink/60">
                  {serviceLabel(p.type)} · {p.suburb}
                </p>
              </div>
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="text-sm font-semibold text-accent hover:underline whitespace-nowrap"
              >
                Edit
              </Link>
              <DeleteProjectButton projectId={p.id} projectTitle={p.title} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
