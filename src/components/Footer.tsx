import Link from "next/link";
import { business, navLinks } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-24">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <div className="font-heading font-bold text-lg tracking-wide">{business.name.toUpperCase()}</div>
          <p className="mt-3 text-sm text-white/75">
            {business.tagline} serving {business.serviceArea}. Licensed and insured, {business.yearsInBusiness}+ years
            local.
          </p>
        </div>

        <div>
          <div className="font-heading font-semibold text-sm uppercase tracking-wide text-white/60">Explore</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/85 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-heading font-semibold text-sm uppercase tracking-wide text-white/60">Contact</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-white/85">
            <li>
              <a href={business.phoneHref} className="hover:text-white">
                {business.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:text-white">
                {business.email}
              </a>
            </li>
            <li>{business.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {business.name} {business.tagline}. ABN/licence details available on request.
      </div>
    </footer>
  );
}
