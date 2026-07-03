import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Офис",
  description: "Teamly-style AI Office web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
