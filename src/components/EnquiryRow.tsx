"use client";

import { useRef } from "react";
import { updateEnquiryStatus, deleteEnquiry } from "@/app/admin/actions";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export default function EnquiryRow({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex items-center gap-3">
      <form ref={formRef} action={async (formData) => updateEnquiryStatus(id, String(formData.get("status")))}>
        <select
          name="status"
          aria-label="Enquiry status"
          defaultValue={status}
          onChange={() => formRef.current?.requestSubmit()}
          className="text-sm border border-border rounded px-2 py-1.5 bg-white capitalize"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </form>
      <form
        action={deleteEnquiry.bind(null, id)}
        onSubmit={(e) => {
          if (!window.confirm("Delete this enquiry?")) e.preventDefault();
        }}
      >
        <button type="submit" className="text-sm font-semibold text-danger hover:underline">
          Delete
        </button>
      </form>
    </div>
  );
}
