import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

// Admin always renders live data (and reads the session in Step 9), so never
// statically prerender these pages.
export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
