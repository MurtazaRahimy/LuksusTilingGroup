"use client";

import { deleteProject } from "@/app/admin/actions";

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  return (
    <form
      action={deleteProject.bind(null, projectId)}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${projectTitle}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm font-semibold text-danger hover:underline whitespace-nowrap">
        Delete
      </button>
    </form>
  );
}
