"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { useToast } from "@/hooks/use-toast";
import type { CategoryWithCount, ProductWithCategory } from "@/types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryWithCount[];
  product?: ProductWithCategory;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(product);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "",
      imageUrl: product?.imageUrl ?? "",
      categoryId: product?.categoryId ?? "",
      featured: product?.featured ?? false,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    const payload = { ...values, slug: values.slug || undefined };
    const result = isEdit
      ? await updateProductAction(product!.id, payload)
      : await createProductAction(payload);

    if (result.success) {
      toast({
        title: isEdit ? "محصول به‌روزرسانی شد" : "محصول ایجاد شد",
      });
      router.push("/admin/products");
      router.refresh();
      return;
    }

    // Surface server-side field errors on the matching inputs.
    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(field as keyof ProductFormValues, {
            message: messages[0],
          });
        }
      }
    }
    toast({ title: "خطا", description: result.error, variant: "destructive" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid max-w-3xl gap-6 lg:grid-cols-[1fr_auto]"
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="name">نام محصول</Label>
          <Input id="name" className="mt-1.5" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="slug">اسلاگ (اختیاری)</Label>
          <Input
            id="slug"
            dir="ltr"
            placeholder="به‌صورت خودکار از نام ساخته می‌شود"
            className="mt-1.5"
            {...register("slug")}
          />
          <FieldError message={errors.slug?.message} />
        </div>

        <div>
          <Label htmlFor="description">توضیحات</Label>
          <Textarea
            id="description"
            rows={5}
            className="mt-1.5"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="price">قیمت (تومان)</Label>
            <Input
              id="price"
              inputMode="numeric"
              dir="ltr"
              className="mt-1.5"
              {...register("price")}
            />
            <FieldError message={errors.price?.message} />
          </div>
          <div>
            <Label htmlFor="stock">موجودی</Label>
            <Input
              id="stock"
              inputMode="numeric"
              dir="ltr"
              className="mt-1.5"
              {...register("stock")}
            />
            <FieldError message={errors.stock?.message} />
          </div>
        </div>

        <div>
          <Label>دسته‌بندی</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="یک دسته انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.categoryId?.message} />
        </div>

        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4 accent-[hsl(var(--primary))]"
              />
              <span className="text-sm">نمایش در بخش محصولات ویژه</span>
            </label>
          )}
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "ذخیرهٔ تغییرات" : "ایجاد محصول"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            انصراف
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">تصویر محصول</Label>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError message={errors.imageUrl?.message} />
      </div>
    </form>
  );
}
