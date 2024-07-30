"use client";
import { LineText } from "@/components/LineText";
import CTAButton from "@/components/home/CTAButton";
import en from "@/locales/en.json"; // 使用路径别名

const Hero = ({ locale, CTALocale }: { locale: any; CTALocale: any }) => {
  locale = en;
  return (
    <div className="flex flex-col items-center">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-16 md:pt-24 text-center">
        <h1>
          {locale.Hero.title1} <LineText>{locale.Hero.title2}</LineText> {locale.Hero.title3}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-2xl tracking-tight text-slate-700 dark:text-slate-400">
          {locale.Hero.description}
        </p>
      </section>
      <CTAButton locale={CTALocale} />
    </div>
  );
};

export default Hero;