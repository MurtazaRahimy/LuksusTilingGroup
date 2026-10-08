export const business = {
  name: "Luksus Tiling Group",
  tagline: "Tiling & Waterproofing",
  phone: "0480 378 474",
  phoneHref: "tel:0480378474",
  email: "AliRazaEkhlasi@gmail.com",
  serviceArea: "Melbourne's eastern suburbs",
  yearsInBusiness: 6,
  hours: "Monday–Saturday, Sunday by appointment",
  licences: ["Licensed Tiler", "Licensed Waterproofer", "Fully Insured"],
};

export const SERVICE_TYPES = [
  { value: "TILING", label: "Tiling", description: "Floor and wall tiling for bathrooms, kitchens and living areas." },
  { value: "SCREEDING", label: "Screeding", description: "Level, durable screed beds prepped and ready for tiling." },
  { value: "STONE", label: "Stone", description: "Natural and engineered stone supply and installation." },
  { value: "WATERPROOFING", label: "Waterproofing", description: "Licensed waterproofing for wet areas, decks and balconies." },
] as const;

export type ServiceTypeValue = (typeof SERVICE_TYPES)[number]["value"];

export function serviceLabel(value: string): string {
  return SERVICE_TYPES.find((s) => s.value === value)?.label ?? value;
}

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
