import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fossil — what refuses to decay",
  description:
    "An anonymous message board where posts decay over time unless the community reinforces them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fossil-bg font-mono antialiased">
        <header className="border-b border-fossil-edge">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <a href="/" className="text-lg font-bold tracking-widest text-fossil-fresh">
              FOSSIL
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/post" className="text-fossil-accent hover:underline">
                write
              </a>
              <a href="/fossils" className="text-fossil-fading hover:text-fossil-fresh">
                fossils
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
