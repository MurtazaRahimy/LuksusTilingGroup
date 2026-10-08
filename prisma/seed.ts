import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.project.count();
  if (existing > 0) {
    console.log("Projects already exist, skipping seed.");
    return;
  }

  const projects = [
    {
      title: "Ensuite Renovation",
      slug: "ensuite-renovation-box-hill",
      suburb: "Box Hill",
      type: "TILING" as const,
      summary: "Full ensuite strip-out and retile with floor-to-ceiling porcelain tiles.",
      description:
        "This is a sample project — replace it from the Admin area. A full ensuite renovation including demolition, waterproofing, and floor-to-ceiling tiling with large-format porcelain.",
      scope: "Demolition, waterproofing membrane, floor and wall tiling, silicone sealing.",
      materials: "600x300 porcelain tiles, waterproofing membrane, epoxy grout.",
      duration: "5 days",
      coverImage: "/placeholders/sample-1.svg",
      coverAlt: "Sample placeholder image for ensuite renovation project",
      clientQuote: null,
      featured: true,
      sortOrder: 1,
      images: {
        create: [
          { url: "/placeholders/sample-2.svg", alt: "Sample before photo", tag: "BEFORE" as const, sortOrder: 1 },
          { url: "/placeholders/sample-1.svg", alt: "Sample after photo", tag: "AFTER" as const, sortOrder: 2 },
        ],
      },
    },
    {
      title: "Alfresco Deck Tiling",
      slug: "alfresco-deck-tiling-doncaster",
      suburb: "Doncaster",
      type: "WATERPROOFING" as const,
      summary: "Outdoor alfresco deck waterproofed and tiled with slip-rated pavers.",
      description:
        "This is a sample project — replace it from the Admin area. Outdoor alfresco area waterproofed and finished with slip-rated tiles suited to Melbourne weather.",
      scope: "Surface prep, waterproofing, fall correction, tiling with slip-rated pavers.",
      materials: "Slip-rated outdoor pavers, exterior waterproofing membrane.",
      duration: "4 days",
      coverImage: "/placeholders/sample-3.svg",
      coverAlt: "Sample placeholder image for alfresco deck tiling project",
      clientQuote: "Sample placeholder quote — replace with a real client quote once collected.",
      featured: true,
      sortOrder: 2,
      images: {
        create: [{ url: "/placeholders/sample-3.svg", alt: "Sample deck photo", tag: "NONE" as const, sortOrder: 1 }],
      },
    },
    {
      title: "Kitchen Splashback",
      slug: "kitchen-splashback-ringwood",
      suburb: "Ringwood",
      type: "STONE" as const,
      summary: "Natural stone splashback installed as part of a kitchen renovation.",
      description:
        "This is a sample project — replace it from the Admin area. A kitchen renovation finished with a natural stone splashback and stone benchtop edge detail.",
      scope: "Stone supply, cutting, and installation of splashback.",
      materials: "Natural stone slab, stone adhesive.",
      duration: "2 days",
      coverImage: "/placeholders/sample-4.svg",
      coverAlt: "Sample placeholder image for kitchen splashback project",
      clientQuote: null,
      featured: true,
      sortOrder: 3,
      images: {
        create: [{ url: "/placeholders/sample-4.svg", alt: "Sample splashback photo", tag: "NONE" as const, sortOrder: 1 }],
      },
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log(`Seeded ${projects.length} sample projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
