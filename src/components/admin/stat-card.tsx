import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{toPersianDigits(value)}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
