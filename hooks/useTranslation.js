// hooks/useTranslation.ts
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { getDictionary } from '@/lib/i18n';

const useTranslation = () => {
  const { lang } = useContext(AppContext);
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };

    fetchDictionary();
  }, [lang]);

  return dictionary;
};

export default useTranslation;