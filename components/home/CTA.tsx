/* eslint-disable react/no-unescaped-entities */
import CTAButton from "@/components/home/CTAButton";
import { RoughNotation } from "react-rough-notation";
import en from "@/locales/en.json"; // 使用路径别名

const CTA = ({ locale, CTALocale }: { locale: any; CTALocale: any }) => {
  locale = en;
  return (
    <div className="flex justify-center">
      <section className="flex flex-col justify-center max-w-[88%] items-center py-16 gap-12">
        <div className="flex flex-col text-center gap-4">
          <h2 className="text-center">{locale.CTA.title}</h2>
          <p className="text-large text-default-500">
            <RoughNotation type="box" color="#b71c1c" show={true}>
              {locale.CTA.description1}
            </RoughNotation>{" "}
            {locale.CTA.description2}{" "}
            <RoughNotation type="box" color="#b71c1c" show={true}>
              {locale.CTA.description3}
            </RoughNotation>{" "}
            {locale.CTA.description4}{" "}
            <RoughNotation type="box" color="#b71c1c" show={true}>
              {locale.CTA.description5}
            </RoughNotation>
            {locale.CTA.description6}
          </p>
        </div>
        <CTAButton locale={CTALocale} />
      </section>
    </div>
  );
};

export default CTA;