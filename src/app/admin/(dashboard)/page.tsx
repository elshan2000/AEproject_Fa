import Link from "next/link";
import { Flower2, Tags, MessageSquare, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/shop/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllInquiries } from "@/services/inquiry.service";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, inquiryCount, featuredCount, inquiries] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.inquiry.count(),
      prisma.product.count({ where: { featured: true } }),
      getAllInquiries(),
    ]);

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <>
      <PageHeader
        title="داشبورد"
        description="نمای کلی فروشگاه شما"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="محصولات" value={productCount} icon={Flower2} />
        <StatCard label="دسته‌بندی‌ها" value={categoryCount} icon={Tags} />
        <StatCard label="محصولات ویژه" value={featuredCount} icon={Star} />
        <StatCard label="پیام‌ها" value={inquiryCount} icon={MessageSquare} />
      </div>

      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">آخرین پیام‌ها</CardTitle>
          <Link
            href="/admin/inquiries"
            className="text-sm text-primary hover:underline"
          >
            مشاهدهٔ همه
          </Link>
        </CardHeader>
        <CardContent>
          {recentInquiries.length > 0 ? (
            <ul className="divide-y divide-border/60">
              {recentInquiries.map((inq) => (
                <li key={inq.id} className="flex flex-wrap gap-2 py-3">
                  <div className="flex-1">
                    <p className="font-medium">{inq.customerName}</p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {inq.message}
                    </p>
                  </div>
                  <div className="text-end text-xs text-muted-foreground">
                    <p dir="ltr">{inq.phone}</p>
                    <p>{formatDate(inq.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="هنوز پیامی ثبت نشده"
              description="پیام‌های مشتریان از فرم تماس اینجا نمایش داده می‌شوند."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
