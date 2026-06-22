import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { EmptyState } from "@/components/shop/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllProducts } from "@/services/product.service";
import { formatPrice, toPersianDigits } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <PageHeader
        title="محصولات"
        description={`${toPersianDigits(products.length)} محصول`}
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" /> محصول جدید
            </Link>
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          title="هنوز محصولی ندارید"
          description="اولین محصول خود را اضافه کنید تا در فروشگاه نمایش داده شود."
          action={
            <Button asChild>
              <Link href="/admin/products/new">افزودن محصول</Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>محصول</TableHead>
                <TableHead>دسته</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>موجودی</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-end">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-secondary/40">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.category.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatPrice(p.price)}
                  </TableCell>
                  <TableCell>{toPersianDigits(p.stock)}</TableCell>
                  <TableCell>
                    {p.featured ? (
                      <Badge>ویژه</Badge>
                    ) : (
                      <Badge variant="secondary">عادی</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        aria-label="ویرایش"
                      >
                        <Link href={`/admin/products/${p.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
