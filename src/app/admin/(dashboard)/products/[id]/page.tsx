import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { listCategories } from "@/services/category.service";
import { toProductWithCategory } from "@/services/mappers";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const [row, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    listCategories(),
  ]);

  if (!row) notFound();
  const product = toProductWithCategory(row);

  return (
    <>
      <PageHeader title="ویرایش محصول" description={product.name} />
      <ProductForm categories={categories} product={product} />
    </>
  );
}
