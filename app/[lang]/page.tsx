// app/[lang]/page.tsx
import HomeIndex from "@/app/(default)/page";
import Layout from '@/app/layout';

export default async function Home({ params }: { params: { lang: string } | undefined }) {
  const lang = params?.lang || 'en'; // 提供一个默认值

  return (
      <HomeIndex lang={lang} />
    
  );
}