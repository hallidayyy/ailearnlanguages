"use client";

import { AppContextProvider } from "@/contexts/AppContext";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header";
import { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/loading.css";

export default function ({ children }: { children: ReactNode }) {
  return (
    <AppContextProvider>
      <div className="w-screen h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </AppContextProvider>
  );
}
