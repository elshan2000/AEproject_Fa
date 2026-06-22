import { PageHeader } from "@/components/admin/page-header";
import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories } from "@/services/category.service";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <>
      <PageHeader
        title="دسته‌بندی‌ها"
        description="دسته‌بندی محصولات فروشگاه را مدیریت کنید"
      />
      <CategoryManager categories={categories} />
    </>
  );
}
