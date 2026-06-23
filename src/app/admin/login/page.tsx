import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "ورود مدیریت",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ from?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-2xl font-semibold">
            {siteConfig.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            ورود به پنل مدیریت
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <LoginForm from={from} />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            بازگشت به فروشگاه
          </Link>
        </p>
      </div>
    </div>
  );
}
