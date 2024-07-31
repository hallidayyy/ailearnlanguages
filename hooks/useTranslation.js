"use client";

import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import { useEffect, useState } from 'react';

const useTranslation = () => {
  const router = useRouter();
  const { locale } = router.query || {};
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    if (locale) {
      getDictionary(locale).then(setTranslations);
    }
  }, [locale]);

  return translations;
};

export default useTranslation;