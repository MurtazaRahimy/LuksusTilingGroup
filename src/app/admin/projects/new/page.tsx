import AdminNav from "@/components/AdminNav";
import ProjectForm from "@/components/ProjectForm";
import { createProject } from "@/app/admin/actions";

export const metadata = { title: "Add Project", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-heading font-bold text-2xl text-primary mb-6">Add Project</h1>
        <div className="bg-white border border-border rounded-md p-6">
          <ProjectForm action={createProject} submitLabel="Create Project" />
        </div>
      </div>
    </>
  );
}
