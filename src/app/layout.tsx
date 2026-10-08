import type { Metadata } from "next";
import { Jost, Work_Sans } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/site";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${business.name} | ${business.tagline} — ${business.serviceArea}`,
    template: `%s | ${business.name}`,
  },
  description: `${business.name} is a licensed tiling and waterproofing business serving ${business.serviceArea}. ${business.yearsInBusiness}+ years local, licensed and insured.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} ${workSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
