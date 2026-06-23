import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Categories to create. Names are Persian; slugs stay latin for clean URLs. */
const categories = [
  { name: "دسته‌گل", slug: "bouquets" },
  { name: "رُز", slug: "roses" },
  { name: "عروسی", slug: "wedding" },
  { name: "گیاهان", slug: "plants" },
  { name: "فصلی", slug: "seasonal" },
];

/** Sample products keyed by category slug so we can resolve the FK after upsert. */
const productsByCategory: Record<
  string,
  Array<{
    name: string;
    slug: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    featured: boolean;
  }>
> = {
  bouquets: [
    {
      name: "دسته‌گل باغ صورتی",
      slug: "blush-garden-bouquet",
      description:
        "آرایشی لطیف از رُزهای باغی، آلاله و اکالیپتوس در طیف‌های صورتی ملایم. دست‌چین‌شده و با کاغذ کرافت بسته‌بندی شده است.",
      price: 890000,
      imageUrl: "/images/products/blush-garden-bouquet.svg",
      stock: 12,
      featured: true,
    },
    {
      name: "دشت گل‌های وحشی",
      slug: "wildflower-meadow",
      description:
        "دسته‌ای بی‌تکلف و انگار تازه‌چیده از گل‌های وحشی فصلی در رنگ‌های پاستلی شاد.",
      price: 650000,
      imageUrl: "/images/products/wildflower-meadow.svg",
      stock: 20,
      featured: false,
    },
  ],
  roses: [
    {
      name: "رُز قرمز کلاسیک",
      slug: "classic-red-roses",
      description:
        "یک دوجین رُز قرمز ساقه‌بلند؛ نماد همیشگی عشق. در کاغذ کادوی شیک تقدیم می‌شود.",
      price: 1200000,
      imageUrl: "/images/products/classic-red-roses.svg",
      stock: 30,
      featured: true,
    },
    {
      name: "باکس رُز شیری",
      slug: "ivory-rose-box",
      description:
        "دو دوجین رُز شیری‌رنگ که در یک باکس یادگاری چیده شده‌اند. لوکس و بی‌سر و صدا.",
      price: 1650000,
      imageUrl: "/images/products/ivory-rose-box.svg",
      stock: 8,
      featured: false,
    },
  ],
  wedding: [
    {
      name: "دسته‌گل عروس آبشاری",
      slug: "bridal-cascade",
      description:
        "دسته‌گل عروس آبشاری از صدتومانی سفید، ارکیده و پیچک آویزان. سفارشی برای روز خاص شما ساخته می‌شود.",
      price: 2400000,
      imageUrl: "/images/products/bridal-cascade.svg",
      stock: 5,
      featured: true,
    },
  ],
  plants: [
    {
      name: "ارکیدهٔ گلدانی",
      slug: "potted-orchid",
      description:
        "یک ارکیدهٔ فالانوپسیس سفید و باوقار در گلدان سرامیکی. ماندگار و کم‌توقع.",
      price: 750000,
      imageUrl: "/images/products/potted-orchid.svg",
      stock: 15,
      featured: false,
    },
  ],
  seasonal: [
    {
      name: "دسته لالهٔ بهاری",
      slug: "spring-tulip-bunch",
      description:
        "دسته‌ای پرطراوت از لاله‌های فصلی در رنگ‌های متنوع. خوش‌آمدگویی روشن به بهار.",
      price: 550000,
      imageUrl: "/images/products/spring-tulip-bunch.svg",
      stock: 25,
      featured: true,
    },
  ],
};

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Admin user (idempotent upsert).
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@kaya.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });
  console.log(`✓ Admin ready: ${admin.email}`);

  // 2. Categories (idempotent upsert by unique slug).
  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categoryIdBySlug.set(c.slug, category.id);
  }
  console.log(`✓ ${categories.length} categories ready`);

  // 3. Products (idempotent upsert by unique slug).
  let productCount = 0;
  for (const [categorySlug, products] of Object.entries(productsByCategory)) {
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) continue;

    for (const p of products) {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          description: p.description,
          price: new Prisma.Decimal(p.price),
          imageUrl: p.imageUrl,
          stock: p.stock,
          featured: p.featured,
          categoryId,
        },
        create: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: new Prisma.Decimal(p.price),
          imageUrl: p.imageUrl,
          stock: p.stock,
          featured: p.featured,
          categoryId,
        },
      });
      productCount++;
    }
  }
  console.log(`✓ ${productCount} products ready`);
  console.log("🌸 Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
