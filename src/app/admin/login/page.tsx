import { business } from "@/lib/site";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-heading font-bold text-2xl text-primary">{business.name} Admin</h1>
      <p className="text-ink/70 text-sm mt-2 mb-8">Sign in to manage projects and enquiries.</p>
      <LoginForm />
    </div>
  );
}
