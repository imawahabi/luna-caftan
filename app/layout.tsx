import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ProductsProvider } from "@/lib/products-context";
import { WishlistProvider } from "@/lib/wishlist-context";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lunacaftan.com'),
  title: "Luna Caftan | قفاطين مغربية فاخرة",
  description: "قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت | Luxury Moroccan Caftans handmade from Fes to Kuwait",
  keywords: ["قفطان", "قفاطين مغربية", "فساتين فاخرة", "تصميم مغربي", "caftan", "moroccan caftan", "luxury fashion", "handmade", "Kuwait"],
  authors: [{ name: "Luna Caftan" }],
  creator: "Luna Caftan",
  publisher: "Luna Caftan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Luna Caftan",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    url: "https://lunacaftan.com",
    siteName: "Luna Caftan",
    title: "Luna Caftan | قفاطين مغربية فاخرة",
    description: "قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Luna Caftan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Caftan | قفاطين مغربية فاخرة",
    description: "قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className={cairo.variable} suppressHydrationWarning>
        <Providers>
          <ProductsProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </ProductsProvider>
        </Providers>
      </body>
    </html>
  );
}
