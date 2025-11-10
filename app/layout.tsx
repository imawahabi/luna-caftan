import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ProductsProvider } from "@/lib/products-context";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luna Caftan | قفاطين مغربية فاخرة",
  description: "قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت",
  icons: {
    icon: "/logo.png",
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
            {children}
          </ProductsProvider>
        </Providers>
      </body>
    </html>
  );
}
