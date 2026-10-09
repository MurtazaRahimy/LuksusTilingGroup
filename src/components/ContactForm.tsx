"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryFormState } from "@/app/(site)/contact/actions";
import { SERVICE_TYPES } from "@/lib/site";

const initialState: EnquiryFormState = {};
const FIELD_ORDER = ["name", "phone", "email", "suburb", "jobType", "description"] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send Enquiry"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // React resets uncontrolled form fields shortly after any action submission
  // (including failed ones). Bumping `attempt` remounts fields with the
  // submitted values as their new defaultValue, so an error never wipes what
  // the person typed.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (state?.error) setAttempt((a) => a + 1);
  }, [state]);

  // Runs after the remount above has committed, so focusing the field here
  // doesn't get clobbered by the remount itself.
  useEffect(() => {
    if (!state?.fieldErrors) return;
    const firstInvalid = FIELD_ORDER.find((f) => state.fieldErrors?.[f]);
    const target = firstInvalid ? formRef.current?.elements.namedItem(firstInvalid) : null;
    if (target instanceof HTMLElement) target.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const values = state?.values;
  const fieldErrors = state?.fieldErrors;

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {state?.error && (
        <p role="alert" className="bg-danger/10 text-danger text-sm font-medium px-4 py-3 rounded border border-danger/30">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" defaultValue={values?.name} attempt={attempt} error={fieldErrors?.name} />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" defaultValue={values?.phone} attempt={attempt} error={fieldErrors?.phone} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={values?.email} attempt={attempt} error={fieldErrors?.email} />
        <Field label="Suburb" name="suburb" required autoComplete="address-level2" defaultValue={values?.suburb} attempt={attempt} error={fieldErrors?.suburb} />
      </div>

      <div>
        <label htmlFor="jobType" className="block text-sm font-semibold text-ink mb-1.5">
          Job type
        </label>
        <select
          key={`jobType-${attempt}`}
          id="jobType"
          name="jobType"
          required
          defaultValue={values?.jobType ?? ""}
          aria-invalid={fieldErrors?.jobType ? true : undefined}
          aria-describedby={fieldErrors?.jobType ? "jobType-error" : undefined}
          className="w-full border border-border rounded px-3 py-2.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-accent"
        >
          <option value="" disabled>
            Select a job type
          </option>
          {SERVICE_TYPES.map((s) => (
            <option key={s.value} value={s.label}>
              {s.label}
            </option>
          ))}
          <option value="Other">Other / not sure</option>
        </select>
        {fieldErrors?.jobType && (
          <p id="jobType-error" className="text-danger text-xs mt-1">
            {fieldErrors.jobType}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-ink mb-1.5">
          Tell us about the job
        </label>
        <textarea
          key={`description-${attempt}`}
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={values?.description}
          aria-invalid={fieldErrors?.description ? true : undefined}
          aria-describedby={fieldErrors?.description ? "description-error" : undefined}
          className="w-full border border-border rounded px-3 py-2.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-accent"
        />
        {fieldErrors?.description && (
          <p id="description-error" className="text-danger text-xs mt-1">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  attempt,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  attempt: number;
  error?: string;
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
        type={type}
        required={required}
        autoComplete={autoComplete}
        spellCheck={type === "email" || type === "tel" ? false : undefined}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full border rounded px-3 py-2.5 text-sm bg-white focus-visible:outline-2 focus-visible:outline-accent ${
          error ? "border-danger" : "border-border"
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="text-danger text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
