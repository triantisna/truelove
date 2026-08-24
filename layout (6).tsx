import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRUELOVE — Interactive Digital Gifts",
  description: "A dynamic platform for personalized romantic digital experiences."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
