import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOTUS POWER ARCHITECT",
  description:
    "Interactive power configurator — Lotus Microsystems. Silicon-based power for the next frontier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased transition-colors duration-200"
        style={{
          background: "var(--bg-white)",
          color: "var(--silicon-grey)",
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
