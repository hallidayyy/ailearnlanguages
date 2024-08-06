// app/(default)/page.tsx

import Hero from "@/components/home/Hero";

import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import CTA from "@/components/home/CTA";
import { defaultLocale, getDictionary } from "@/lib/i18n";



export default async function HomeIndex({ lang }: { lang: string }) {
    const langName = lang || defaultLocale;
    const dict = await getDictionary(langName);
    return (
        <div className="w-full px-6">
            <Hero locale={dict.Hero} CTALocale={dict.CTAButton} />
            <Features id="Features" locale={dict.Feature} langName={langName} />
            {/* <FAQ id="FAQ" locale={dict.FAQ} langName={langName} /> */}
            {/* <Pricing id="Pricing" locale={dict.Pricing} langName={langName} /> */}
            <CTA locale={dict.CTA} CTALocale={dict.CTAButton} />
        </div>
    );
}