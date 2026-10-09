# Luxus — Tiling & Waterproofing website

A website for Luxus, built with a built-in admin area so the owner can add and edit projects without touching code.

## What's in here

- **Public site:** Home, Projects (with filtering), individual project pages with photo galleries, Services, About, and a Contact/Get-a-Quote form.
- **Admin area** (`/admin`): add/edit/delete projects, manage gallery photos, and view enquiries submitted through the contact form.
- Photos uploaded through the admin area are automatically resized and compressed so the site stays fast.

## How it's built (in plain terms)

- **Next.js** — the framework that runs both the pages people see and the admin area, all from one project.
- **SQLite** (a single database file, `prisma/dev.db`) — holds all the projects, photos, and enquiries. It's the simplest possible database: no separate server to set up, no accounts to create, just a file. Perfect for getting started.
- **Prisma** — the tool that talks to that database file.
- A single **admin password** (set in `.env`) protects `/admin` — no user accounts to manage, just one password you can change any time.

This is the simplest setup that's still reliable for a small business site. The one thing to know: SQLite stores everything in a local file, so if you ever move the site to a host where the server resets its files between visits (like Vercel's free tier), you'd lose data. See **Deploying** below for what to do instead.

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (version 20 or newer).

```bash
npm install          # install everything the project needs
npm run db:seed      # add 3 sample projects so the site isn't empty (safe to skip/re-run)
npm run dev          # start the site
```

Open **http://localhost:3000** to see the site, and **http://localhost:3000/admin** to log in to the admin area.

The admin password is set in the `.env` file at the project root:

```
ADMIN_PASSWORD="changeme123"
```

**Change this before the site goes live.** Open `.env`, change the password, save, and restart the site.

## Adding and editing projects

1. Go to `/admin` and log in.
2. Click **+ Add Project**, fill in the details, and upload a cover photo.
3. After saving, you can add more photos to that project's gallery — tag each one as **Before** or **After** if relevant.
4. Toggle **Published** off if you want to save a project as a draft without it showing on the live site, or **Feature on homepage** to show it in the "Recent projects" section on the home page.
5. To update an existing project, go to the dashboard and click **Edit** next to it.

Photos are automatically resized and converted to a fast web format on upload — just pick the photo from your phone or computer, no editing needed first.

## Viewing enquiries

Every "Get a Quote" form submission appears in `/admin/enquiries`, with the customer's details and job description. You can mark each one as *contacted*, *quoted*, *won*, or *lost* to keep track.

If `RESEND_API_KEY` is set (see **Deploying** below), you'll also get an email the moment a new enquiry comes in, sent to the address in `src/lib/site.ts` — reply to that email and it goes straight to the customer. Without that key, enquiries still save normally; you'd just need to check `/admin/enquiries` yourself.

## Before going live

The site currently has 6 real projects loaded, covering all four services (Tiling, Screeding, Stone, Waterproofing), and a testimonial placeholder. Before going live:

- Keep adding real projects from `/admin` as you complete more jobs — the homepage and Services page automatically pull in the latest ones.
- Replace the placeholder testimonial and the "About" page story with your real content (`src/app/(site)/about/page.tsx`).
- Update the business details (phone, email, hours) in `src/lib/site.ts`.

## Deploying (making the site live on the internet)

This site deploys on **Netlify**, using two free hosted services so nothing is lost when Netlify resets its disk between builds:

- **[Turso](https://turso.tech)** — hosted SQLite, holds all projects, gallery photos metadata, and enquiries.
- **[Cloudinary](https://cloudinary.com)** — stores photos uploaded through the admin area and contact form.
- **[Resend](https://resend.com)** *(optional)* — emails you the moment a new enquiry comes in. Free plan, no domain verification needed since it only sends to your own inbox. Without it, enquiries still save fine, just silently.

Locally, none of these are needed — the app automatically falls back to the local SQLite file and `public/uploads/` folder when their environment variables aren't set.

Environment variables to set in Netlify's dashboard (**Site configuration → Environment variables**):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | `file:./dev.db` (only so Prisma's build step doesn't complain — the live site actually uses Turso) |
| `TURSO_DATABASE_URL` | From `turso db show <name> --url` |
| `TURSO_AUTH_TOKEN` | From `turso db tokens create <name>` |
| `CLOUDINARY_URL` | From the Cloudinary dashboard's "API Environment variable" |
| `RESEND_API_KEY` | From the Resend dashboard — optional, skip to disable email notifications |
| `ADMIN_PASSWORD` | A strong password, not `changeme123` |
| `SESSION_SECRET` | A random string — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

If you'd rather skip the hosted-services setup entirely, this app also runs fine on any basic Linux VPS with Node.js installed (e.g. a $5/month DigitalOcean droplet) — there, the local SQLite file and `public/uploads/` folder work as-is, since the server's disk actually persists.

Whichever route you take, remember to change `ADMIN_PASSWORD` and `SESSION_SECRET` to new values before going live, and never commit `.env` to a public code repository.

## Project structure (for a developer picking this up)

```
prisma/schema.prisma       Database structure (projects, gallery photos, enquiries)
prisma/seed.ts              Sample data
src/app/(site)/              Public pages (home, projects, services, about, contact)
src/app/admin/                Admin pages and the server actions that power them
src/components/               Shared UI pieces (nav, forms, image gallery, etc.)
src/lib/site.ts               Business details, services list, nav links — edit here first
src/lib/images.ts              Photo upload + resizing logic
public/uploads/                Where uploaded photos are saved
```
