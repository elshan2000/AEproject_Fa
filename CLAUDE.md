# CLAUDE.md — کایا (Kaya) Flower Shop

## Project overview

Full-stack Persian/RTL flower shop called **کایا (Kaya)**.
Public storefront + password-protected admin dashboard.
Built with Next.js 15 App Router, TypeScript, Tailwind CSS, PostgreSQL 16, Prisma 6.

**Dev server:** `npm run dev` → http://localhost:3000  
**Admin panel:** http://localhost:3000/admin  
**Default admin:** `admin@kaya.local` / `admin12345`

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript 5 (`strict`, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS + shadcn/ui (new-york style, Radix UI primitives) |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma 6 |
| Auth | HMAC-SHA256 JWT via `jose` + bcrypt cost 12 |
| Forms | React Hook Form + Zod |
| Font | Vazirmatn (Persian/Arabic + Latin) via `next/font/google` |

---

## Key commands

```bash
npm run dev          # dev server
npm run build        # prisma generate + next build (standalone output)
npm run typecheck    # tsc --noEmit
npm run db:migrate   # prisma migrate dev (dev only)
npm run db:deploy    # prisma migrate deploy (production)
npm run db:seed      # tsx prisma/seed.ts
npm run db:studio    # Prisma Studio GUI
```

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx               # root: lang="fa" dir="rtl", Vazirmatn font
│   ├── (shop)/                  # public storefront (layout has WhatsAppFab)
│   │   ├── page.tsx             # home: Hero + FeaturedProducts + CategorySection
│   │   ├── products/page.tsx    # listing with filter/search/sort/pagination
│   │   ├── products/[slug]/     # product detail + related products
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx     # reads ?product= slug to pre-fill form
│   ├── admin/
│   │   ├── login/page.tsx       # outside (dashboard) group, no auth layout
│   │   └── (dashboard)/         # force-dynamic; getSession() defense-in-depth
│   │       ├── layout.tsx
│   │       ├── page.tsx         # stats dashboard
│   │       ├── products/        # list + new + [id] edit
│   │       ├── categories/
│   │       └── inquiries/
│   └── api/
│       ├── auth/{login,logout,session}/
│       ├── admin/upload/        # multipart image upload → public/uploads/
│       ├── products/            # GET list, POST create; [id] GET/PUT/DELETE
│       ├── categories/
│       └── inquiries/
├── actions/                     # "use server" — thin wrappers over services
│   ├── auth.ts                  # loginAction, logoutAction
│   ├── product.ts               # createProductAction, updateProductAction, deleteProductAction
│   ├── category.ts
│   ├── inquiry.ts
│   └── types.ts                 # ActionResult<T>, FieldErrors
├── services/                    # pure data logic, importable from actions + API routes
│   ├── auth.service.ts          # verifyCredentials (user-enumeration safe)
│   ├── product.service.ts       # listProducts, getFeaturedProducts, CRUD
│   ├── category.service.ts
│   ├── inquiry.service.ts
│   └── mappers.ts               # Prisma rows → serializable DTOs
├── components/
│   ├── admin/                   # AdminSidebar, ProductForm, ImageUpload, LoginForm …
│   └── shop/                    # ProductCard, ProductGallery, ContactForm, WhatsAppButton …
│       └── ui/                  # shadcn/ui base components
└── lib/
    ├── session.ts               # EDGE-SAFE JWT (used by middleware + auth.ts)
    ├── auth.ts                  # Node-only: cookie helpers, requireAdmin(), getSession()
    ├── env.ts                   # Zod-validated env at boot
    ├── prisma.ts                # singleton PrismaClient (survives HMR)
    ├── site.ts                  # siteConfig: name, tagline, phone, email, nav
    ├── utils.ts                 # cn(), formatPrice(), toPersianDigits(), formatDate(), slugify()
    └── validations/
        ├── product.ts           # productCreateSchema, productUpdateSchema, productFormSchema
        ├── category.ts
        ├── inquiry.ts
        └── auth.ts
├── middleware.ts                # Edge runtime — guards /admin/:path*
└── types/index.ts               # Serializable DTOs (no Decimal/Date)
```

---

## Database schema (Prisma)

4 models — `categories`, `products`, `inquiries`, `admins`.

- **Price** stored as `Decimal(10,2)` — never Float.
- Product → Category: `onDelete: Restrict` (can't delete category with products).
- Inquiry → Product: `onDelete: SetNull` (product can be deleted; inquiry stays).
- All IDs are `cuid()`.
- Products have a unique `slug` (auto-generated from name via `slugifyWithFallback`).

---

## Authentication architecture

**Critical split** — middleware runs on the Edge runtime; Node APIs can't run there.

| Module | Runtime | What it does |
|---|---|---|
| `lib/session.ts` | Edge-safe | JWT sign/verify only (pure `jose`). No `server-only`, no `next/headers`, no Prisma. |
| `lib/auth.ts` | Node only | Cookie helpers (`setSessionCookie`, `clearSessionCookie`, `getSession`, `requireAdmin`). Imports `server-only`. |
| `middleware.ts` | Edge | Imports ONLY `lib/session.ts`. Redirects unauthenticated → `/admin/login?from=<path>`. |
| `admin/(dashboard)/layout.tsx` | Node | Defense-in-depth: calls `getSession()` even though middleware already checked. `export const dynamic = "force-dynamic"`. |

JWT issuer: `"kaya"`. Changing `SESSION_SECRET` or the issuer string invalidates all sessions.

**Security properties:**
- bcrypt cost 12 for password hashing.
- DUMMY_HASH compare when email not found → constant-time, no user-enumeration.
- Login error is always generic ("ایمیل یا رمز اشتباه است").
- Cookie: `HttpOnly; Secure; SameSite=lax; Max-Age=604800` (7 days).
- `from=` redirect param only accepted if it starts with `/admin` (open-redirect protection).

---

## Persian / RTL conventions

- Root layout: `<html lang="fa" dir="rtl">`.
- Use **logical CSS** throughout: `start`/`end` not `left`/`right` (e.g. `border-s`, `ms-4`, `ps-3`).
- No `uppercase` or `tracking-*` on Persian text — breaks readability.
- Numbers: `toPersianDigits()` for counts; `formatPrice()` for prices (uses `Intl.NumberFormat("fa-IR")` + تومان suffix).
- Dates: `formatDate()` uses `Intl.DateTimeFormat("fa-IR")` which outputs Jalali calendar automatically.
- Phone inputs: `dir="ltr"` (digits are LTR even on RTL page).
- Slug regex allows `؀-ۿ` Unicode range for Persian slugs.
- Font fallback chain: `Vazirmatn → Tahoma → system-ui`.

---

## DTOs — server/client boundary

Services return serializable DTOs (`src/types/index.ts`), not raw Prisma rows:
- `Decimal` → `number`
- `Date` → ISO string

**Never pass a raw Prisma row to a Client Component.** Always go through `mappers.ts`.

---

## Image upload

`POST /api/admin/upload` — admin only, max 4 MB, MIME whitelist (jpeg/png/webp/avif/svg).  
Saves to `public/uploads/<uuid>.<ext>`, returns `{ url: "/uploads/..." }`.  
Client: `src/components/admin/image-upload.tsx` — also accepts a pasted URL.

**On serverless (Vercel):** `public/uploads/` is ephemeral. Replace with S3/Cloudinary.  
**On VPS/Docker:** mount `public/uploads/` as a persistent volume.

---

## Validation schema rules

All validation messages are in Persian. Key limits:
- Product price: `> 0` and `<= 100_000_000` (100M Tomans max).
- Product name: 2–120 chars.
- Description: 10–5000 chars.
- Image URL: 1–2048 chars (required).
- Phone (inquiry): regex `^[0-9+\-\s()]+$`.

Two schemas per form: **server schema** (Zod with `coerce`) in `validations/`, **client schema** (`productFormSchema`) for RHF. Server actions always re-validate with the server schema.

---

## Env variables

```
DATABASE_URL              PostgreSQL connection string
SESSION_SECRET            JWT signing secret — min 32 chars (generate: openssl rand -base64 48)
NEXT_PUBLIC_SITE_URL      Public base URL (e.g. https://kaya.ir)
SEED_ADMIN_EMAIL          First admin email (seed only)
SEED_ADMIN_PASSWORD       First admin password (seed only — change after first login)
NODE_ENV                  "production" enables Secure cookie flag
```

---

## Production deployment

Two paths — see `README.md` for full instructions:

1. **Docker Compose (recommended):** `docker compose up -d --build` + `docker compose run --rm migrate`
2. **PM2 on VPS:** `./scripts/deploy.sh` (pulls, migrates, builds, zero-downtime reload)

Files:
- `Dockerfile` — multi-stage, Alpine-based, uses `output: "standalone"`
- `docker-compose.yml` — full stack (Postgres + Next.js)
- `docker-compose.db.yml` — Postgres only
- `nginx/kaya.conf` — reverse proxy with HTTPS + security headers
- `ecosystem.config.cjs` — PM2 cluster config

**Production checklist:**
- `SESSION_SECRET` ≥ 48 random chars
- Change admin password from `admin12345`
- `NODE_ENV=production`
- Firewall blocks port 5432 (Postgres not public)
- `public/uploads/` on a persistent volume

---

## Known gotchas

- `lib/session.ts` must stay edge-safe. Never add `server-only`, `next/headers`, or Prisma imports to it.
- `admin/(dashboard)/layout.tsx` must keep `export const dynamic = "force-dynamic"` or admin pages get statically prerendered.
- `notFound()` must be called in **both** `generateMetadata()` and the page body on product detail pages — calling it only in the body results in a soft-404 (200 status).
- `toPersianDigits()` uses `String.fromCharCode(0x06f0 + digit)` — do NOT use `"۰۱۲۳۴۵۶۷۸۹"[n]` (fails under `noUncheckedIndexedAccess`).
- `slugify()` preserves `؀-ۿ` range for Persian slugs. Use `slugifyWithFallback()` in services (never returns empty string).
- `next.config.ts` has `dangerouslyAllowSVG: true` for placeholder product SVGs.
- The `productQuerySchema` uses field name `category` (the URL param) but maps it to `categorySlug` when calling `listProducts()`.

---

## React Native mobile app — IN PROGRESS (branch `reactNative`)

Rebuilding the storefront + admin dashboard as a native app (Android + iOS) in **`/mobile`**, using Expo, that consumes this Next.js app's REST API. This section is the durable record of the plan/progress — the ephemeral Claude Code plan file used to design it lives only on the machine that created it, so **this section is the source of truth when resuming on a different machine.** When the user says "continue [the mobile app / from my home pc]", re-read this whole section first, then check `git log`/`git status` and the actual state of `/mobile` before writing any code — don't trust this doc blindly if it disagrees with what's on disk.

### Decisions already made (do not re-litigate)
- Scope: storefront **and** admin dashboard (not storefront-only).
- Toolchain: **Expo** managed workflow (user is on Linux, no Mac — Expo Go / EAS Build is how iOS gets tested/built without owning a Mac).
- Location: `/mobile` in this repo, on the `reactNative` branch.
- Admin auth: bearer-token JWT (added to the existing backend — see below), not cookie-based, since native apps can't use the web's HttpOnly cookie flow.

### Backend changes already made (in `/src`, done and typechecked)
1. `src/lib/auth.ts` — `getSession()` now also checks an `Authorization: Bearer <token>` header (via `headers()` from `next/headers`) as a fallback when there's no session cookie, verified with the existing `verifySessionToken()`. Every route using `requireAdmin()` (products/categories CRUD, inquiries GET, upload) transparently supports bearer tokens now — no per-route changes needed.
2. `src/app/api/auth/login/route.ts` — response is now `{ user, token }` (previously just `{ user }`). Cookie is still set for the web. Mobile stores `token`.
3. New `src/app/api/admin/stats/route.ts` (`GET`, admin-only) — `{ productCount, categoryCount, featuredCount, inquiryCount }`. The web dashboard queries Prisma directly server-side; mobile needed this over HTTP instead.
4. No CORS changes needed (native `fetch` isn't subject to browser CORS).

### Mobile scaffold status
- Created via `npx create-expo-app@latest mobile` — **this pulled Expo SDK 57** (React Native 0.86, React 19.2), which is newer than common training-data knowledge. The template itself ships an `AGENTS.md`/`CLAUDE.md` saying "Expo HAS CHANGED, read https://docs.expo.dev/versions/v57.0.0/ before writing code" — **heed that** if anything below looks off vs. what you expect from older Expo versions. Routes live under `mobile/src/app` (not root `app/`), alias `@/*` → `mobile/src/*` (see `mobile/tsconfig.json`).
- **`mobile/.npmrc`** pins `registry=https://registry.npmjs.org/`, scoped to this subproject only. Reason: this machine's global npm registry (`/usr/etc/npmrc`, a private mirror at `registry.buluttakin.com`) intermittently 404'd on fresh Expo packages. Do **not** touch the global registry config — only this project-local override.
- NativeWind (Tailwind for RN) configured: `mobile/tailwind.config.js` (brand colors converted from the web's `globals.css` HSL vars to hex — primary muted rose `#ae425d`, warm background `#fdfcfc`, etc.), `babel.config.js`, `metro.config.js` (`withNativeWind`), `mobile/src/global.css` (tailwind directives + kept template's font CSS vars), `nativewind-env.d.ts`.
- `app.json` updated: name `"کایا"`, slug `kaya-mobile`, scheme `kaya`, `web.bundler: "metro"`, RTL via `extra: { supportsRTL: true, forcesRTL: true }` + `"expo-localization"` plugin (static config approach — works in Expo Go without a manual `I18nManager`/reload dance, per current Expo docs).
- Fonts: `@expo-google-fonts/vazirmatn` installed (npm-published font package, avoids needing to source `.ttf` binaries manually) + `expo-font`. Not yet wired into a `useFonts()` call in the root layout.
- Other installed deps: `@tanstack/react-query`, `react-hook-form` + `@hookform/resolvers` + `zod`, `expo-secure-store` (admin token storage), `expo-image-picker` (product image upload), `lucide-react-native` + `react-native-svg` (icon parity with web's `lucide-react`).
- **Cross-repo sharing decision:** the small, framework-agnostic pieces (Zod validation schemas, DTOs, site config, Persian formatting helpers) are **duplicated** into `mobile/src/lib/`, not imported across from `/src` — avoids fragile Metro cross-directory config. Only actual data comes live over HTTP.
- Written so far: `mobile/src/lib/types.ts` (DTOs), `mobile/src/lib/site.ts` (site config). **Not yet written**, still needed:
  - `mobile/src/lib/format.ts` — `formatPrice`, `toPersianDigits`, `formatDate`, `slugify` (port from `src/lib/utils.ts`; watch for the Hermes/Intl `fa-IR` + Jalali-calendar gotcha noted below).
  - `mobile/src/lib/validations/{product,category,inquiry,auth}.ts` — port Zod schemas verbatim from `src/lib/validations/*` (same field limits/regex/Persian messages — see "Validation schema rules" above).
  - `mobile/src/lib/api-client.ts` — fetch wrapper: base URL from `EXPO_PUBLIC_API_URL` env var, JSON handling, attaches `Authorization: Bearer <token>` when present, typed errors matching the API's `{error, details}` shape (`ApiErrorBody` type already in `types.ts`).
  - `mobile/src/lib/auth-storage.ts` (expo-secure-store get/set/clear token), `mobile/src/lib/auth-context.tsx` (token state + login/logout, gates admin routes), `mobile/src/lib/query-client.ts`.
  - `mobile/src/hooks/{use-products,use-categories,use-inquiries,use-admin-stats,use-auth}.ts` — react-query hooks over the api-client.
  - `mobile/src/components/{shop,admin,ui}/*` — see the full component-by-component parity list captured during planning (ProductCard, ProductGrid, ProductsFilters, Pagination, ContactForm, WhatsAppButton, Hero, FeaturedProducts, CategorySection, EmptyState, SectionHeading for shop; ProductForm, ImageUpload, LoginForm, CategoryManager, StatCard, DeleteProductButton/ConfirmDialog, PageHeader for admin; Button/TextInput/Card/Select/Checkbox/Badge as RN `ui/` primitives replacing shadcn).
  - `mobile/src/app/(shop)/*` and `mobile/src/app/admin/*` route screens (Expo Router) — see the "Feature parity map" below.
  - Template boilerplate still present and **should be deleted/replaced** as real screens land: `mobile/src/app/{index,explore}.tsx`, `mobile/src/components/{animated-icon*,app-tabs*,external-link,hint-row,web-badge,themed-text,themed-view}.tsx`, `mobile/src/hooks/{use-color-scheme*,use-theme}.ts`, `mobile/src/constants/theme.ts` (the app is light-theme-only, Persian-only — no dark mode / locale switcher needed, mirroring the web app).

### Feature parity map (what each screen must do)
**Storefront** (public, no auth) — `GET /api/products` (page/pageSize/category/search/sort), `GET /api/products/[idOrSlug]`, `GET /api/categories`, `POST /api/inquiries`: home, product listing (debounced search + category filter + sort + pagination), product detail + related products, about, contact (pre-filled from a product via a slug param), WhatsApp (`wa.me/{phoneE164}`) / `tel:` deep links.

**Admin** (bearer-token gated) — same read routes plus `POST/PUT/DELETE /api/products/[id]`, `POST/PUT/DELETE /api/categories/[id]`, `GET /api/inquiries`, `POST /api/admin/upload` (multipart field name **must stay `file`**, 4MB limit, jpeg/png/webp/avif/svg only, returns `{url}`), `GET /api/admin/stats` (new), `POST /api/auth/login` (now returns `{user, token}`): login, dashboard stats + recent inquiries, product list/create/edit/delete (image picker → multipart upload), category manager (add/rename/delete), inquiries feed.

Every screen must reuse the exact validation rules already in `src/lib/validations/*` (product name 2–120 chars, price >0 and ≤100M, inquiry phone regex `^[0-9+\-\s()]+$`, etc.) — no new business rules invented.

### Known risks to verify while building (not blocking)
- **Hermes `Intl` + `fa-IR` + Jalali calendar**: verify on-device that `Intl.DateTimeFormat("fa-IR")` actually outputs Jalali dates under Expo SDK 57's Hermes. If not, fall back to a small JS Jalali-conversion helper for `formatDate` only.
- **iOS without a Mac**: Expo Go for iterative dev; EAS Build (cloud) for a real installable/TestFlight build.
- Both `/` (web) and `/mobile` need `npm install` run independently after a fresh clone — they are two separate `node_modules` trees, not a workspace/monorepo.

### Delivery order / current position
1. ✅ Backend bearer-token + stats route (done, typechecked).
2. 🚧 Scaffold `/mobile` (Expo Router + NativeWind + fonts/RTL + theme + api-client + duplicated validations/types) — **in progress, paused here** (see "Not yet written" list above).
3. ⬜ Storefront screens end-to-end against the real API.
4. ⬜ Admin auth + admin screens end-to-end.
5. ⬜ Verify: `npm run typecheck` (web), run the Expo app and exercise both storefront and admin flows against the local dev server (`npm run dev` in `/`) — note: nobody has run the Expo dev server / tested on a simulator or device yet, this is unverified beyond `npm install` succeeding and the config files being written.
