"use client";

import { AppContextProvider } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext"; // 导入 LanguageProvider
import Footer from "@/components/footer/Footer";
import Header from "@/components/header";
import { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/loading.css";
import { Analytics } from "@vercel/analytics/react"

export default function ({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider> {/* 包裹 LanguageProvider */}
      <AppContextProvider>
        <div className="w-screen h-screen">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </AppContextProvider>
    </LanguageProvider>
  );
}