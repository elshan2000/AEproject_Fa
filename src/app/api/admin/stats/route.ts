import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats — admin only. Aggregate counts for the dashboard.
 * The web dashboard queries Prisma directly from a Server Component; native
 * clients need this over HTTP instead.
 */
export async function GET() {
  try {
    await requireAdmin();

    const [productCount, categoryCount, featuredCount, inquiryCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.product.count({ where: { featured: true } }),
        prisma.inquiry.count(),
      ]);

    return NextResponse.json({
      productCount,
      categoryCount,
      featuredCount,
      inquiryCount,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
