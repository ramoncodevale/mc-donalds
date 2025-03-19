import { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";
import { CartProvider } from "./[slug]/menu/contexts/cart";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FSW Donald's",
  description: "Bora finalizar esse projeto lindo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <CartProvider>
        {children}
        </CartProvider>

        <Toaster />
      </body>
    </html>
  );
}
