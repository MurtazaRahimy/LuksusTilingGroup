"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { SERVICE_TYPES } from "@/lib/site";
import type { ProjectFormState } from "@/app/admin/actions";

const initialState: ProjectFormState = {};

type ProjectFormValues = {
  title: string;
  suburb: string;
  type: string;
  summary: string;
  description: string;
  scope: string;
  materials: string;
  duration: string;
  clientQuote: string;
  featured: boolean;
  published: boolean;
  coverImage?: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function ProjectForm({
  action,
  submitLabel,
  initialValues,
}: {
  action: (prevState: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  submitLabel: string;
  initialValues?: ProjectFormValues;
}) {
  const [state, formAction] = useActionState(action, initialState);

  // React resets uncontrolled fields shortly after any action submission,
  // including failed ones. Bumping `attempt` remounts fields with the
  // last-submitted values as their new defaultValue, so a validation error
  // never wipes what was typed.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (state?.error) setAttempt((a) => a + 1);
  }, [state]);

  const values = state?.values ?? initialValues;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state?.error && (
        <p role="alert" className="bg-danger/10 text-danger text-sm font-medium px-4 py-3 rounded border border-danger/30">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Title" name="title" defaultValue={values?.title} required attempt={attempt} />
        <TextField label="Suburb" name="suburb" defaultValue={values?.suburb} required attempt={attempt} />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-semibold text-ink mb-1.5">
          Service type
        </label>
        <select
          key={`type-${attempt}`}
          id="type"
          name="type"
          required
          defaultValue={values?.type ?? ""}
          className="w-full border border-border rounded px-3 py-2.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-accent"
        >
          <option value="" disabled>
            Select a type
          </option>
          {SERVICE_TYPES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <TextField label="Short summary (shown on cards)" name="summary" defaultValue={values?.summary} required attempt={attempt} />

      <TextAreaField label="Full description" name="description" defaultValue={values?.description} required rows={5} attempt={attempt} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextAreaField label="Scope of work" name="scope" defaultValue={values?.scope} required rows={3} attempt={attempt} />
        <TextAreaField label="Materials used" name="materials" defaultValue={values?.materials} required rows={3} attempt={attempt} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Duration" name="duration" defaultValue={values?.duration} required placeholder="e.g. 4 days" attempt={attempt} />
        <TextField label="Client quote (optional)" name="clientQuote" defaultValue={values?.clientQuote} attempt={attempt} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            key={`featured-${attempt}`}
            type="checkbox"
            name="featured"
            defaultChecked={values?.featured}
            className="w-4 h-4"
          />
          Feature on homepage
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            key={`published-${attempt}`}
            type="checkbox"
            name="published"
            defaultChecked={values?.published ?? true}
            className="w-4 h-4"
          />
          Published (visible on site)
        </label>
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-semibold text-ink mb-1.5">
          Cover photo {initialValues ? "(leave empty to keep current)" : ""}
        </label>
        {initialValues?.coverImage && (
          <div className="relative w-40 h-28 rounded overflow-hidden mb-2 border border-border">
            <Image src={initialValues.coverImage} alt="Current cover" fill className="object-cover" />
          </div>
        )}
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          required={!initialValues}
          className="w-full text-sm"
        />
        <p className="text-xs text-ink/50 mt-1">Photos are automatically resized and optimised.</p>
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  attempt,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  attempt: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink mb-1.5">
        {label}
      </label>
      <input
        key={`${name}-${attempt}`}
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full border border-border rounded px-3 py-2.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-accent"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  rows,
  attempt,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  attempt: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-ink mb-1.5">
        {label}
      </label>
      <textarea
        key={`${name}-${attempt}`}
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows ?? 4}
        className="w-full border border-border rounded px-3 py-2.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-accent"
      />
    </div>
  );
}
