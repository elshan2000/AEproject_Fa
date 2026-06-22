import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { listCategories } from "@/services/category.service";

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <>
      <PageHeader title="محصول جدید" description="یک محصول تازه به فروشگاه اضافه کنید" />
      <ProductForm categories={categories} />
    </>
  );
}
