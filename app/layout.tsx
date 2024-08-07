import "@/styles/globals.css";

import { Toaster, toast } from "sonner";

import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LanguePod",
  description:
    "flexible, immersive audio lessons for language skills and cultural insights on-the-go.",
  keywords: "language learning podcasts, podcast for language learners, learn languages online, audio language lessons, podcast immersion, language podcast subscription, cultural language podcast, podcast language practice, multilingual podcasts, podcast language acquisition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster position="top-center" richColors />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
