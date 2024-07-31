// app/[lang]/layout.tsx
import DefaultLayout from '@/app/(default)/layout';

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}