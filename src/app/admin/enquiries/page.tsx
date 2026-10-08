import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/AdminNav";
import EnquiryRow from "@/components/EnquiryRow";

export const metadata = { title: "Enquiries", robots: { index: false, follow: false } };

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-heading font-bold text-2xl text-primary mb-6">Enquiries</h1>

        {enquiries.length === 0 ? (
          <p className="text-ink/60 text-sm">No enquiries yet.</p>
        ) : (
          <div className="space-y-4">
            {enquiries.map((e) => (
              <div key={e.id} className="bg-white border border-border rounded-md p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">
                      {e.name} <span className="text-ink/50 font-normal">· {e.suburb}</span>
                    </p>
                    <p className="text-sm text-ink/70">
                      <a href={`tel:${e.phone}`} className="hover:underline">
                        {e.phone}
                      </a>{" "}
                      ·{" "}
                      <a href={`mailto:${e.email}`} className="hover:underline">
                        {e.email}
                      </a>
                    </p>
                    <p className="text-xs text-ink/50 mt-1">
                      {e.jobType} · {new Date(e.createdAt).toLocaleString("en-AU")}
                    </p>
                  </div>
                  <EnquiryRow id={e.id} status={e.status} />
                </div>
                <p className="text-sm text-ink/85 mt-3">{e.description}</p>
                {e.photoUrl && (
                  <div className="relative w-32 h-24 rounded overflow-hidden mt-3 border border-border">
                    <Image src={e.photoUrl} alt="Enquiry attachment" fill className="object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
