import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Planora — Plan beautiful moments",
    template: "%s | Planora",
  },

  description:
    "Planora is a collaborative event planning platform for weddings, celebrations, corporate events, and special occasions.",

  applicationName: "Planora",

  icons: {
    icon: [
      {
        url: "/brand/planora-mark.png",
        type: "image/png",
      },
    ],
    shortcut: "/brand/planora-mark.png",
    apple: "/brand/planora-mark.png",
  },

  openGraph: {
    title: "Planora — Plan beautiful moments",
    description:
      "Plan tasks, guests, budgets, vendors, invitations, seating and more in one elegant workspace.",
    type: "website",
    siteName: "Planora",
  },
};

export const viewport: Viewport = {
  themeColor: "#08172F",
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