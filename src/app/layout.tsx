import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = settings.defaultSeoTitle || `${settings.brandName} | IT Training IT Training & Placement Assistance in Bengaluru Placement Assistance in Bengaluru`;
  const description =
    settings.defaultSeoDesc ||
    `${settings.brandName} provides career-focused US IT Training and Australia IT training in Bengaluru with practical learning and placement assistance.`;
  const ogImage = settings.defaultOgImage || `${siteUrl}/vertexit-logo-transparent.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.brandName}`,
    },
    description,
    keywords: [
      "US IT Training",
      "US IT Training Training",
      "US IT Training Course",
      "US IT Jobs",
      "US IT careers",
      "IT Training Bengaluru",
      "Australia IT training",
      "Australia IT Processing",
      "Australian IT operations",
      "Software Operations Training",
      "IT operations Training",
      "VertexIT",
    ],
    authors: [{ name: settings.brandName }],
    creator: settings.brandName,
    publisher: settings.brandName,
    icons: {
      icon: "/vertexit-logo-transparent.png",
      shortcut: "/vertexit-logo-transparent.png",
      apple: "/vertexit-logo-transparent.png",
    },
    manifest: undefined,
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: settings.brandName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.brandName }],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
        <Sonner position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
