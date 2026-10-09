import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${business.name} — licensed, insured, and local to ${business.serviceArea}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <h1 className="font-heading font-bold text-4xl text-primary text-balance">About {business.name}</h1>

      <div className="mt-8 space-y-5 text-ink/85 leading-relaxed max-w-2xl">
        <p>
          {business.name} is a tiling and waterproofing business based in and serving {business.serviceArea}. For
          over {business.yearsInBusiness} years we&rsquo;ve been doing the kind of work that speaks for itself —
          straight lines, solid falls, and waterproofing that actually holds up.
        </p>
        <p>
          Luksus is a family-owned business that started in 2022. It&rsquo;s run mainly by Akbar Ekhlasi, who
          brings experience in the trade going back to 1992 — over three decades of tiling and waterproofing work
          across Melbourne before Luksus was its own name on the van.
        </p>
        <p>
          That kind of experience shows in the details other businesses miss: falls that actually drain,
          waterproofing that&rsquo;s done properly the first time, and tiling that still looks sharp years later.
          Akbar started Luksus to do things his own way — honest pricing, real communication, and a standard of
          work he&rsquo;d be happy to put his name on.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-heading font-semibold text-xl text-primary mb-3">Our values</h2>
          <ul className="space-y-2 text-ink/80 text-sm">
            <li>— Do the job properly, every time</li>
            <li>— Turn up on time, finish on time</li>
            <li>— Use materials built to last</li>
            <li>— Be straight about price and scope upfront</li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl text-primary mb-3">Licences &amp; insurance</h2>
          <ul className="space-y-2 text-ink/80 text-sm">
            {business.licences.map((l) => (
              <li key={l}>— {l}</li>
            ))}
          </ul>
          <p className="text-xs text-ink/50 mt-3">
            Licence numbers and certificates available on request — add them here once confirmed.
          </p>
        </div>
      </div>

      <div className="mt-16 bg-primary text-white rounded-md p-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-heading font-semibold text-xl">Got a job in mind?</p>
        <Link href="/contact" className="bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90">
          Get a Quote
        </Link>
      </div>
    </div>
  );
}
