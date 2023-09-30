import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import colors from "tailwindcss/colors";
import { Analytics } from "@vercel/analytics/react";

import type { Metadata } from "next";

import "balloon-css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qriginals.com"),
  title: "Qriginals | Create and Share QR Code Art | AI Generated QRs",
  description:
    "Experience QR Codes like never before on Qriginals.com. Our AI Art Generator lets you beautify your codes and share your creations.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} bg-white h-full`}>
      <body className="h-full">
        <NextTopLoader color={colors.fuchsia[600]} />
        {props.children}
        <Toaster position="bottom-center" />
        <Analytics />
      </body>
    </html>
  );
}
