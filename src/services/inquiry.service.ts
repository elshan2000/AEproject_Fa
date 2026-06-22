import { prisma } from "@/lib/prisma";
import { toInquiryWithProduct } from "@/services/mappers";
import type { InquiryWithProduct } from "@/types";
import type { InquiryCreateInput } from "@/lib/validations/inquiry";

const withProduct = {
  product: { select: { id: true, name: true, slug: true } },
} as const;

/** Admin: every inquiry, newest first, joined with its (optional) product. */
export async function getAllInquiries(): Promise<InquiryWithProduct[]> {
  const rows = await prisma.inquiry.findMany({
    include: withProduct,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toInquiryWithProduct);
}

/** Total number of inquiries (for the dashboard). */
export async function countInquiries(): Promise<number> {
  return prisma.inquiry.count();
}

/** Create an inquiry. `productId` is validated to exist when provided. */
export async function createInquiry(
  input: InquiryCreateInput
): Promise<InquiryWithProduct> {
  let productId: string | null = null;

  if (input.productSlug) {
    const product = await prisma.product.findUnique({
      where: { slug: input.productSlug },
      select: { id: true },
    });
    productId = product?.id ?? null;
  }

  const created = await prisma.inquiry.create({
    data: {
      customerName: input.customerName,
      phone: input.phone,
      message: input.message,
      productId,
    },
    include: withProduct,
  });
  return toInquiryWithProduct(created);
}
