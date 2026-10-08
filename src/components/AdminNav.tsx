import Link from "next/link";
import { business } from "@/lib/site";

export default function AdminNav() {
  return (
    <div className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-heading font-bold tracking-wide">{business.name.toUpperCase()} ADMIN</span>
          <nav className="flex gap-6 text-sm font-medium" aria-label="Admin">
            <Link href="/admin" className="hover:underline">
              Projects
            </Link>
            <Link href="/admin/enquiries" className="hover:underline">
              Enquiries
            </Link>
            <Link href="/" className="hover:underline text-white/70">
              View site ↗
            </Link>
          </nav>
        </div>
        <form action="/admin/logout" method="post">
          <button type="submit" className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded">
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
