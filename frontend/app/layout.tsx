import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planora — Plan your event beautifully",
  description:
    "A collaborative event planning platform for weddings, celebrations, and special events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}