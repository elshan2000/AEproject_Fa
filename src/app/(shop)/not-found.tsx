import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shop/empty-state";

export default function NotFound() {
  return (
    <div className="section py-24">
      <EmptyState
        title="صفحه پیدا نشد"
        description="صفحه یا محصولی که دنبالش هستید وجود ندارد یا جابه‌جا شده است."
        action={
          <Button asChild>
            <Link href="/products">مشاهدهٔ مجموعه</Link>
          </Button>
        }
      />
    </div>
  );
}
