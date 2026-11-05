# HYXC Interiors: Website + Admin Dashboard (MERN)

Premium interior design website for HYXC Interiors (Ajman, UAE) with a secure admin dashboard.

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Framer Motion, Lucide, React Hook Form + Zod, React Helmet
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Zod validation, Cloudinary uploads, Helmet, rate limiting

```
hyxc-interiors/
├── api/index.js            Vercel serverless entry (runs the Express API)
├── vercel.json             Vercel build + rewrites (single project for site + API)
├── client/                 React app (public site + /admin)
│   ├── public/             logo.jpg (original, untouched), robots.txt
│   └── src/
│       ├── components/     Navbar, Footer, cards, forms, sections, UI helpers
│       ├── pages/          Home + all inner pages
│       ├── admin/          Login, dashboard, CRUD screens
│       ├── context/        Site settings/services context
│       └── lib/            api client, constants (contact info, FAQ, process)
└── server/
    └── src/
        ├── models/         Admin, Service, Project, Enquiry, Testimonial, Settings, Seo
        ├── controllers/    CRUD factory + enquiries, auth, settings, SEO, uploads, sitemap
        ├── routes/         Public + JWT-protected /api/admin routes
        ├── middleware/     auth, validation, upload, error handling
        └── seed.js         Creates the admin account + starter content
```

## 1. Setup

Requirements: Node 18+ and a MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas), free tier is fine).

### Server
```bash
cd server
cp .env.example .env      # then fill in the values
npm install
npm run seed              # creates admin + starter content
npm run dev               # API on http://localhost:5000
```

Fill in `server/.env`:

| Variable | Notes |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | 32+ random chars: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Your own admin login (min 10 chars), used only by `npm run seed` |
| `CLOUDINARY_*` | From your Cloudinary dashboard. Without these, uploads show a clear error and you can paste image/video URLs instead |
| `CLIENT_URL` | Allowed front-end origin(s) for CORS |
| `SITE_URL` | Public site URL for the sitemap (`https://hyxc.ae`) |

### Client
```bash
cd client
npm install
npm run dev               # http://localhost:5173 (proxies /api to the server)
```

Admin panel: `http://localhost:5173/admin` (sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set before seeding).
To change the admin password later, edit `ADMIN_PASSWORD` and run `npm run seed` again (content is never overwritten).

## 2. What is included

**Public site:** Home (all 11 sections), About, Services, Service details (with WhatsApp enquiry button), Projects (with filters), Project details, Process, FAQ, Contact, Privacy Policy, Terms, 404. Floating WhatsApp button on every page (`https://wa.me/971528868393` with the prefilled message).

**Admin dashboard:** Overview stats, Enquiries (status, internal notes, delete), Projects (multi-image upload, before/after, featured), Services, Testimonials (publish/unpublish), Homepage (hero text/image, contact details, social links, featured projects), SEO per page (title, description, keywords, OG image, canonical).

**Security:** passwords hashed with bcrypt, JWT-protected admin API, no credentials in source, rate limits on login and enquiries, honeypot spam field, Helmet headers, body-size limits, field whitelisting on writes, validated input (Zod) on the client and the server.

## 3. Content you must replace

- **Projects are DEMO content** (flagged "Demo content" on the site). Replace them in Admin > Projects with real HYXC projects.
- **Testimonials are placeholders** (flagged "Placeholder"). Add genuine, authorised reviews; set a rating only where verified.
- **Videos** can be added per project in Admin > Projects (uploaded to Cloudinary, shown on the project page).
- **Images** are sample stock photos from Unsplash, referenced by URL in `server/src/seed.js`. They are not verified to remain online, and a fallback panel shows if one fails. Replace them with HYXC's own photography through the admin panel.
- **Social links** are empty until you add them in Admin > Homepage; icons stay disabled until then.
- **Privacy Policy / Terms** are short starter text. Have them reviewed before launch.
- **Logo:** the original file is used unchanged (`client/public/logo.jpg`), shown in a circular frame. For best results on dark backgrounds, supply a transparent-background PNG/SVG of the same logo and replace that file.

## 4. Free hosting: MongoDB Atlas + Cloudinary + Vercel

Everything runs on free tiers. The website and the API deploy as **one Vercel project** (same domain, so no CORS or API-URL setup).

### Step 1: Free database (MongoDB Atlas)
1. Create an account at mongodb.com/atlas and create a **free M0 cluster**.
2. Database Access: add a database user (username + password).
3. Network Access: add `0.0.0.0/0` (Vercel uses changing IPs, so it cannot be a single address).
4. Connect > Drivers: copy the connection string, replace `<password>`, and add the database name, e.g.
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/hyxc?retryWrites=true&w=majority`
   (If the password has special characters, URL-encode them.)

### Step 2: Free media storage (Cloudinary)
1. Create a free account at cloudinary.com.
2. From the dashboard copy **Cloud name**, **API Key**, **API Secret**.
3. Free-plan per-file limits: images 10 MB, videos 100 MB (enforced in the admin upload with a clear message). Images are delivered as WebP/AVIF automatically.

### Step 3: Seed the database (once, from your computer)
**Shortcut:** inside `server`, run `npm install` then `npm run setup`. It asks for your Atlas/Cloudinary values and an admin login, generates `JWT_SECRET`, writes `.env`, seeds the database, and creates `vercel-env.txt` that you paste into Vercel > Settings > Environment Variables (paste into the first Key box and it fills every variable). Both files are git-ignored; keep them private.

Manual way:
```bash
cd server
cp .env.example .env     # fill MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, CLOUDINARY_*
npm install
npm run seed
```
This points at the same Atlas database that production uses.

### Step 4: Push to GitHub and import into Vercel
1. Push this whole folder to a GitHub repository (`.env` is git-ignored, so secrets are not uploaded).
2. In Vercel: **Add New > Project**, import the repo, keep the **root directory as the repo root**. `vercel.json` already sets the install/build commands and routing, so leave the framework preset as "Other".
3. Under **Environment Variables** add (Production):

| Name | Value |
|---|---|
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | 32+ random characters |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | from Cloudinary |
| `SITE_URL` | `https://hyxc.ae` (or your Vercel URL until the domain is connected) |
| `NODE_ENV` | `production` |

   You do **not** need `ADMIN_EMAIL`/`ADMIN_PASSWORD` on Vercel (they are only used by the local seed) and you do not set `VITE_API_URL` or `CLIENT_URL`.
4. Deploy. Then open `/api/health` (should show `{"ok":true}`), the homepage, and `/admin`.

### Step 5: Connect hyxc.ae
Vercel project > Settings > Domains > add `hyxc.ae` and `www.hyxc.ae`, then set the DNS records Vercel shows at your domain registrar.

### Notes
- **Uploads go straight from the browser to Cloudinary** using a short-lived signature from the API, so Vercel's 4.5 MB request limit never applies and video works.
- The admin area and API are on the same domain as the site: admin is at `https://hyxc.ae/admin`.
- Rate limits are per serverless instance (in-memory), so they slow casual abuse but are not a hard global limit.
- Atlas free clusters (M0) can be slow on the very first request after idle time.
- `package.json` at the repo root lists the API dependencies for Vercel; keep it in sync with `server/package.json` if you add packages.
- Local development is unchanged: `server` on port 5000 and `client` on 5173.

## 5. SEO status (be aware)

Implemented: unique title/description/canonical/Open Graph per page (editable in admin), schema.org `HomeAndConstructionBusiness`, `Service` and `FAQPage` JSON-LD, semantic HTML, image alt text, lazy-loaded images, code-split admin, dynamic XML sitemap, `robots.txt`.

**Not implemented: server-side rendering or prerendering.** The site is a client-rendered SPA. Google renders JavaScript, but for the strongest UAE search results add prerendering before launch (for example a Vite prerender plugin or moving the public site to Next.js). This is the main recommended follow-up.

Image formats: Cloudinary images are requested with `f_auto,q_auto`, which serves WebP/AVIF to supporting browsers.

## 6. Verification status

- Client production build passes (`npm run build`).
- Server modules load, syntax checks pass, the enquiry validation schema was exercised, the Vercel entry (`api/index.js`) answers `/api/health`, and the Cloudinary upload signature is generated.
- **Not yet run end-to-end on Vercel, or against a live MongoDB or Cloudinary account**, because those credentials were not available when this was built. Follow section 1, then submit a test enquiry and check it appears in Admin > Enquiries.
