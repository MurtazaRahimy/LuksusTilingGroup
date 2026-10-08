"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdmin, type LoginFormState } from "@/app/admin/login/actions";

const initialState: LoginFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <p role="alert" className="bg-danger/10 text-danger text-sm font-medium px-4 py-3 rounded border border-danger/30">
          {state.error}
        </p>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full border border-border rounded px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
