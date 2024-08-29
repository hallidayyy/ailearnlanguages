import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AppContextProvider } from "@/contexts/AppContext"; // Import your AppContextProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  // themeColor: siteConfig.themeColors,
  icons: siteConfig.icons,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <head>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-H3Z3LJ0TJ5"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-H3Z3LJ0TJ5');
                `,
              }}
            />
          </head>
          <body className={inter.className}>
            <Toaster position="top-center" richColors />
            {children}
            <Analytics />
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}