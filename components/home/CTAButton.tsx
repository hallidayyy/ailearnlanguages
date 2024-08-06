"use client";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import { AppContext } from '@/contexts/AppContext';
import { getDictionary } from '@/lib/i18n';
import React, { useState, useEffect, useContext } from 'react';


const CTAButton = () => {
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
  return (
    <Link
      href="https://github.com/weijunext/landing-page-boilerplate"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <Button
        variant="default"
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        aria-label="Get Boilerplate"
      >
        <RocketIcon />
        {locale.CTAButton.title}
      </Button>
    </Link>
  );
};

export default CTAButton;