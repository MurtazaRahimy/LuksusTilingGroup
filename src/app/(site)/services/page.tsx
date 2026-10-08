import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SERVICE_TYPES, business } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `Tiling, screeding, stone and waterproofing services from ${business.name}, serving ${business.serviceArea}.`,
};

export default async function ServicesPage() {
  const sampleByType = await Promise.all(
    SERVICE_TYPES.map((s) =>
      prisma.project.findFirst({
        where: { type: s.value, published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      })
    )
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <h1 className="font-heading font-bold text-4xl text-primary text-balance">Services</h1>
      <p className="text-ink/75 mt-3 max-w-xl">
        Licensed tiling and waterproofing for homes across {business.serviceArea}.
      </p>

      <div className="mt-12 space-y-14">
        {SERVICE_TYPES.map((s, i) => {
          const sample = sampleByType[i];
          return (
            <div key={s.value} className="grid gap-6 sm:grid-cols-2 items-center">
              <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                <h2 className="font-heading font-semibold text-2xl text-primary">{s.label}</h2>
                <p className="text-ink/75 mt-3 leading-relaxed">{s.description}</p>
                {sample && (
                  <Link
                    href={`/projects/${sample.slug}`}
                    className="inline-block mt-4 text-accent font-semibold hover:underline"
                  >
                    See a recent {s.label.toLowerCase()} job →
                  </Link>
                )}
              </div>
              <div className={`relative h-56 sm:h-64 rounded-md overflow-hidden ${i % 2 === 1 ? "sm:order-1" : ""}`}>
                <Image
                  src={sample?.coverImage ?? "/placeholders/sample-5.svg"}
                  alt={sample?.coverAlt || `${s.label} example`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-primary text-white rounded-md p-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-heading font-semibold text-xl">Need one of these done properly?</p>
        <Link href="/contact" className="bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90">
          Get a Quote
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
