import type { Metadata } from "next";
import { business } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact / Get a Quote",
  description: `Get a quote from ${business.name} — tiling and waterproofing in ${business.serviceArea}.`,
};

type SearchParams = Promise<{ success?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const { success } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      <h1 className="font-heading font-bold text-4xl text-primary text-balance">Get a Quote</h1>
      <p className="text-ink/75 mt-3 max-w-xl">
        Tell us about the job and we&rsquo;ll get back to you.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-3">
        <div className="sm:col-span-2">
          {success === "1" ? (
            <div className="bg-primary text-white rounded-md p-8">
              <h2 className="font-heading font-semibold text-xl">Thanks — got it!</h2>
              <p className="mt-2 text-white/85">
                We&rsquo;ve received your enquiry and will be in touch shortly. In the meantime, feel free to call
                us directly on{" "}
                <a href={business.phoneHref} className="underline font-semibold">
                  {business.phone}
                </a>
                .
              </p>
            </div>
          ) : (
            <ContactForm />
          )}
        </div>

        <aside className="bg-muted rounded-md p-6 h-fit">
          <h2 className="font-heading font-semibold text-lg text-primary mb-4">Contact details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-primary">Phone</dt>
              <dd>
                <a href={business.phoneHref} className="text-accent hover:underline">
                  {business.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Email</dt>
              <dd>
                <a href={`mailto:${business.email}`} className="text-accent hover:underline break-all">
                  {business.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Service area</dt>
              <dd className="text-ink/80">{business.serviceArea}</dd>
            </div>
            <div>
              <dt className="font-semibold text-primary">Hours</dt>
              <dd className="text-ink/80">{business.hours}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
