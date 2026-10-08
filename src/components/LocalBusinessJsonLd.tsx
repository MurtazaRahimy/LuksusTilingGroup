import { business } from "@/lib/site";

export default function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    description: `${business.tagline} serving ${business.serviceArea}.`,
    telephone: business.phone,
    email: business.email,
    areaServed: business.serviceArea,
    address: {
      "@type": "PostalAddress",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
