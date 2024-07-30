import Covers from "@/components/covers";
import Hero from "@/components/home/Hero";
import Input from "@/components/input";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import CTA from "@/components/home/CTA";

export default function () {
  return (
    <div className="w-full px-6">
      <Hero />
      <Features />
      <FAQ />
      <Pricing />
      <CTA />
      <Input />
      <Covers />
    </div>
  );
}
