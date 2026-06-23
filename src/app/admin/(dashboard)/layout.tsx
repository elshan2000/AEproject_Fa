import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

// Admin always renders live data and reads the session cookie, so never
// statically prerender these pages.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Defense in depth: middleware already guards /admin/*, but we re-check the
  // session here so the dashboard can never render without a valid admin.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
