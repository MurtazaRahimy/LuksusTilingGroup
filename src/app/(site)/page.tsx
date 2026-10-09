import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { business, SERVICE_TYPES } from "@/lib/site";
import ProjectCard from "@/components/ProjectCard";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";

export default async function HomePage() {
  const featuredProjects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });

  const heroImage = featuredProjects[0]?.coverImage ?? "/placeholders/sample-1.svg";

  return (
    <>
      <LocalBusinessJsonLd />

      {/* HERO */}
      <section className="relative min-h-[520px] flex items-end">
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/0" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-16 text-white">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl leading-tight max-w-2xl text-balance">
            Tiling &amp; waterproofing for {business.serviceArea}
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-xl">
            Licensed, insured, and local — {business.yearsInBusiness}+ years of honest work you can see in every job
            we finish.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-accent text-white font-semibold px-6 py-3 rounded hover:opacity-90 transition-opacity"
            >
              Get a Quote
            </Link>
            <Link
              href="/projects"
              className="border border-white text-white font-semibold px-6 py-3 rounded hover:bg-white/10 transition-colors"
            >
              View Our Work
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {business.licences.map((l) => (
              <span key={l} className="border border-white/50 text-white text-xs font-semibold px-3 py-1 rounded">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-18 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-heading font-bold text-3xl text-primary mb-4 text-balance">Honest work, done properly</h2>
          <p className="text-ink/75 max-w-xl mb-10">
            No shortcuts, no surprises — just quality tiling and waterproofing from a crew that lives and works in
            the eastern suburbs.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <WhyItem title="Licensed & Insured" text="Fully licensed for tiling and waterproofing, with insurance to back every job." />
            <WhyItem title={`${business.yearsInBusiness}+ Years Local`} text="Based in and serving the eastern suburbs — we know the area and the building codes." />
            <WhyItem title="On Time" text="We turn up when we say we will and finish when we say we will." />
            <WhyItem title="Quality Materials" text="We use materials built to last, not the cheapest option on the shelf." />
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="py-18 sm:py-24 bg-muted">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading font-bold text-3xl text-primary mb-4 text-balance">Recent projects</h2>
            <p className="text-ink/75 max-w-xl mb-10">A few of our latest jobs across the eastern suburbs.</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={{
                    slug: p.slug,
                    title: p.title,
                    suburb: p.suburb,
                    type: p.type,
                    summary: p.summary,
                    coverImage: p.coverImage,
                    coverAlt: p.coverAlt,
                  }}
                />
              ))}
            </div>
            <div className="mt-10">
              <Link href="/projects" className="text-accent font-semibold hover:underline">
                View all projects →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES OVERVIEW */}
      <section className="py-18 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-heading font-bold text-3xl text-primary mb-4 text-balance">Services</h2>
          <p className="text-ink/75 max-w-xl mb-10">
            Tiling, screeding, stone and waterproofing for bathrooms, kitchens, decks and renovations.
          </p>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {SERVICE_TYPES.map((s) => (
              <div key={s.value} className="flex gap-4 items-baseline">
                <h3 className="font-heading font-semibold text-lg text-primary whitespace-nowrap">{s.label}</h3>
                <p className="text-sm text-ink/75">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/services" className="text-accent font-semibold hover:underline">
              More about our services →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-18 sm:py-24 bg-muted">
        <div className="mx-auto max-w-6xl px-6">
          <div className="bg-primary text-white rounded-md p-10 sm:p-14 text-center">
            <p className="font-heading italic text-xl sm:text-2xl max-w-2xl mx-auto">
              &ldquo;Simply amazing. Great service, great communication and everything finalised on time with
              quality.&rdquo;
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-white/60">— Previous Employer</p>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="bg-accent text-white py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-heading font-semibold text-xl">Ready to get started?</h3>
          <a href={business.phoneHref} className="font-heading font-bold text-2xl hover:underline">
            {business.phone}
          </a>
        </div>
      </section>
    </>
  );
}

function WhyItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t-[3px] border-accent pt-4">
      <h3 className="font-heading font-semibold text-lg text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-ink/75">{text}</p>
    </div>
  );
}

export const dynamic = "force-dynamic";
