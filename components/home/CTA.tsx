"use client";

import useTranslation from '@/hooks/useTranslation';
import CTAButton from '@/components/home/CTAButton';
import { RoughNotation } from 'react-rough-notation';
import { AppContext } from '@/contexts/AppContext';
import { getDictionary } from '@/lib/i18n';
import React, { useState, useEffect, useContext } from 'react';

const CTA = () => {
  const { lang } = useContext(AppContext);
  const [locale, setLocale] = useState<any>(null);

  useEffect(() => {
    const fetchLocale = async () => {
      try {
        const dict = await getDictionary(lang);
        setLocale(dict);
      } catch (error) {
        console.error('Error fetching locale:', error);
      }
    };

    fetchLocale();
  }, [lang]);

  // 确保 locale 数据已加载
  if (!locale) return <div>Loading...</div>;
  // console.log(locale);

  return (
    <div className="flex justify-center">
      <section className="flex flex-col justify-center max-w-[88%] items-center py-16 gap-12">
        <div className="flex flex-col text-center gap-4">
          <h2 className="text-center">{locale.CTA.title}</h2>
          <p className="text-large text-default-500">
            <RoughNotation type="box" color="#b71c1c" show={true}>
              {locale.CTA.description1}
            </RoughNotation>{' '}
            {locale.CTA.description2}{' '}
            <RoughNotation type="box" color="#b71c1c" show={true}>
              {locale.CTA.description3}
            </RoughNotation>{' '}
            {locale.CTA.description4}{' '}
            <RoughNotation type="box" color="#b71c1c" show={true}>
              {locale.CTA.description5}
            </RoughNotation>
            {locale.CTA.description6}
          </p>
        </div>
        <CTAButton />
      </section>
    </div>
  );
};

export default CTA;