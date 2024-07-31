// components/layout.tsx
import Header from '@/components/header';
import Footer from '@/components/footer/Footer';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}