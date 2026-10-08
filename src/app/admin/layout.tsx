export const metadata = { robots: { index: false, follow: false } };
// Every admin page submits a mutating Server Action (login, create/update
// project, enquiry status, etc). Without this, a page with no dynamic data
// access gets statically optimized and Next.js will cache + replay its first
// Action response for every later request, ignoring new input entirely.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-muted">{children}</div>;
}
