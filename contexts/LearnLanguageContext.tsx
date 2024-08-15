import React, { createContext, useState, useContext, ReactNode } from 'react';

const languages = [
  { code: '1', name: 'english', flag: '🇺🇸' },
  { code: '2', name: 'french', flag: '🇫🇷' },
  { code: '3', name: 'chinese', flag: '🇨🇳' },
  { code: '4', name: 'japanese', flag: '🇯🇵' },
];

interface LanguageContextType {
  selectedLang: typeof languages[0];
  setSelectedLang: (lang: typeof languages[0]) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  selectedLang: languages[0],
  setSelectedLang: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <LanguageContext.Provider value={{ selectedLang, setSelectedLang }}>
      {children}
    </LanguageContext.Provider>
  );
};