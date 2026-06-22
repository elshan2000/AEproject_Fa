import Link from "next/link";

// Global fallback 404 (used for routes outside the storefront layout).
export default function NotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "Tahoma, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>۴۰۴ — صفحه پیدا نشد</h1>
        <p style={{ color: "#666" }}>این صفحه پیدا نشد.</p>
        <Link href="/" style={{ color: "#b03a5b" }}>
          بازگشت به خانه
        </Link>
      </body>
    </html>
  );
}
