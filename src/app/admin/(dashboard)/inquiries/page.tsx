import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shop/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllInquiries } from "@/services/inquiry.service";
import { formatDate, toPersianDigits } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  return (
    <>
      <PageHeader
        title="پیام‌ها"
        description={`${toPersianDigits(inquiries.length)} پیام از مشتریان`}
      />

      {inquiries.length === 0 ? (
        <EmptyState
          title="هنوز پیامی ثبت نشده"
          description="پیام‌های مشتریان از فرم تماس اینجا نمایش داده می‌شوند."
        />
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>مشتری</TableHead>
                <TableHead>تماس</TableHead>
                <TableHead>پیام</TableHead>
                <TableHead>محصول</TableHead>
                <TableHead>تاریخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium">
                    {inq.customerName}
                  </TableCell>
                  <TableCell dir="ltr" className="whitespace-nowrap text-start">
                    <a href={`tel:${inq.phone}`} className="hover:text-primary">
                      {inq.phone}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {inq.message}
                    </p>
                  </TableCell>
                  <TableCell>
                    {inq.product ? (
                      <Link
                        href={`/products/${inq.product.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {inq.product.name}
                      </Link>
                    ) : (
                      <Badge variant="secondary">عمومی</Badge>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(inq.createdAt)}
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
