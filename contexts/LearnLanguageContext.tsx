import React, { createContext, useState, useContext } from 'react';

const languages = [
  { code: '1', name: 'english', flag: '🇺🇸' },
  { code: '3', name: 'chinese', flag: '🇨🇳' },
  { code: '4', name: 'japanese', flag: '🇯🇵' },
  { code: '2', name: 'french', flag: '🇫🇷' },
  { code: '5', name: 'german', flag: '🇩🇪' },
];

const LanguageContext = createContext<{
  selectedLang: typeof languages[0];
  setSelectedLang: (lang: typeof languages[0]) => void;
}>({
  selectedLang: languages[0],
  setSelectedLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <LanguageContext.Provider value={{ selectedLang, setSelectedLang }}>
      {children}
    </LanguageContext.Provider>
  );
};