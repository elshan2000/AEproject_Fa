# خانهٔ گل — Flower Shop

فروشگاه اینترنتی گل با Next.js 15، TypeScript، Tailwind CSS، PostgreSQL، و Prisma ORM.

## فناوری‌های استفاده شده

| لایه | ابزار |
|---|---|
| فریم‌ورک | Next.js 15 (App Router) |
| زبان | TypeScript 5 |
| استایل | Tailwind CSS + shadcn/ui |
| پایگاه داده | PostgreSQL 16 |
| ORM | Prisma 6 |
| احراز هویت | HMAC-SHA256 JWT (jose) + bcrypt 12 |
| فرم | React Hook Form + Zod |
| فونت | Vazirmatn (فارسی) |

---

## راه‌اندازی محیط توسعه (Development)

### ۱. پیش‌نیازها

- Node.js 20 LTS
- Docker + Docker Compose (برای PostgreSQL)

### ۲. کلون و نصب

```bash
git clone <repo-url> flower-shop
cd flower-shop
npm install
```

### ۳. متغیرهای محیطی

```bash
cp .env.example .env
# .env را با مقادیر واقعی پر کنید
```

مقدار `SESSION_SECRET` را با دستور زیر تولید کنید:

```bash
openssl rand -base64 48
```

### ۴. راه‌اندازی پایگاه داده

```bash
# فقط Postgres
docker compose -f docker-compose.db.yml up -d

# Migration + seed داده‌های اولیه
npm run db:migrate
npm run db:seed
```

### ۵. اجرای سرور توسعه

```bash
npm run dev
```

- فروشگاه: http://localhost:3000
- پنل مدیریت: http://localhost:3000/admin
  - ایمیل: `admin@flowershop.local`
  - رمز: `admin12345` — **حتماً در تولید تغییر دهید!**

---

## استقرار در تولید (Production)

دو روش وجود دارد: **Docker (توصیه شده)** یا **PM2 مستقیم روی سرور**.

---

### روش ۱: Docker Compose (ساده‌تر)

```bash
# ۱. کپی و تنظیم متغیرهای محیطی
cp .env.example .env
nano .env   # تمام مقادیر واقعی را وارد کنید

# ۲. ساخت و اجرا
docker compose up -d --build

# ۳. Migration و seed (فقط اولین بار)
docker compose run --rm migrate

# ۴. بررسی وضعیت
docker compose ps
docker compose logs -f app
```

برای به‌روزرسانی در آینده:

```bash
git pull
docker compose up -d --build
docker compose run --rm migrate  # اگر migration جدید وجود دارد
```

---

### روش ۲: PM2 روی VPS (بدون Docker برای اپ)

#### پیش‌نیازها روی سرور

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
npm i -g pm2

# Postgres (با Docker)
docker compose -f docker-compose.db.yml up -d
```

#### استقرار اولیه

```bash
cp .env.example .env && nano .env

# Migration + seed
npx prisma migrate deploy
npm run db:seed

# Build + راه‌اندازی PM2
npm run build
cp -r public .next/standalone/public
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup   # دستور خروجی را اجرا کنید تا بعد از reboot هم بماند
```

#### به‌روزرسانی بعدی

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

### Nginx Reverse Proxy

```bash
sudo cp nginx/flower-shop.conf /etc/nginx/sites-available/flower-shop
# آدرس دامنه را در فایل ویرایش کنید:
sudo nano /etc/nginx/sites-available/flower-shop
# example.com را با دامنه واقعی جایگزین کنید

sudo ln -s /etc/nginx/sites-available/flower-shop /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL با Let's Encrypt
sudo certbot --nginx -d example.com -d www.example.com
```

---

## دستورات پرکاربرد

| دستور | کاربرد |
|---|---|
| `npm run dev` | سرور توسعه |
| `npm run build` | Build تولید |
| `npm run start` | اجرای Build |
| `npm run typecheck` | بررسی TypeScript |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Migration در توسعه |
| `npm run db:deploy` | Migration در تولید |
| `npm run db:seed` | داده‌های اولیه |
| `npm run db:studio` | Prisma Studio |

---

## ساختار پروژه

```
src/
├── app/
│   ├── (shop)/          # صفحات فروشگاه (عمومی)
│   ├── admin/           # پنل مدیریت (محافظت‌شده)
│   └── api/             # API Routes
├── actions/             # Server Actions
├── components/
│   ├── admin/           # کامپوننت‌های پنل مدیریت
│   ├── shop/            # کامپوننت‌های فروشگاه
│   └── ui/              # shadcn/ui پایه
├── lib/
│   ├── session.ts       # JWT (edge-safe)
│   ├── auth.ts          # Cookie helpers (Node-only)
│   ├── env.ts           # اعتبارسنجی متغیرهای محیطی
│   └── validations/     # طرح‌های Zod
├── services/            # منطق دسترسی به داده
└── types/               # DTOهای قابل انتقال
prisma/
├── schema.prisma        # مدل‌های دیتابیس
└── seed.ts              # داده‌های اولیه
```

---

## چک‌لیست امنیتی قبل از تولید

- [ ] `SESSION_SECRET` حداقل ۴۸ کاراکتر تصادفی باشد (`openssl rand -base64 48`)
- [ ] رمز ادمین از `admin12345` به رمز قوی تغییر یابد (از طریق پنل مدیریت)
- [ ] `NEXT_PUBLIC_SITE_URL` آدرس HTTPS واقعی باشد
- [ ] `SEED_ADMIN_EMAIL` به ایمیل واقعی تغییر یابد
- [ ] `POSTGRES_PASSWORD` رمز قوی باشد (حداقل ۲۰ کاراکتر تصادفی)
- [ ] فایل `.env` هرگز commit نشود (در `.gitignore` است)
- [ ] HTTPS فعال باشد (Certbot)
- [ ] فایروال پورت `5432` را مسدود کند (فقط `127.0.0.1`)
- [ ] دایرکتوری `public/uploads/` در یک Volume پایدار mount شده باشد
- [ ] Nginx header `Strict-Transport-Security` فعال باشد
- [ ] `NODE_ENV=production` تنظیم شده باشد (cookie.Secure فعال می‌شود)

### توجه برای محیط‌های Serverless (Vercel / Netlify)

آپلود تصاویر به `public/uploads/` روی سرورهای ephemeral کار نمی‌کند. برای این محیط‌ها باید:

1. **Cloudinary** یا **AWS S3** به‌عنوان storage استفاده شود.
2. `src/app/api/admin/upload/route.ts` برای آپلود به سرویس خارجی اصلاح شود.
3. `remotePatterns` در `next.config.ts` به دامنه CDN محدود شود.

---

## مجوز

این پروژه یک پیاده‌سازی نمونه است.
