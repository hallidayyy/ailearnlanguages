import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LearnLanguageContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const languages = [
  { code: '1', name: 'english', flag: '🇺🇸' },
  { code: '3', name: 'spanish', flag: '🇪🇸' },
  { code: '4', name: 'german', flag: '🇩🇪' },
  { code: '2', name: 'french', flag: '🇫🇷' },
  { code: '5', name: 'italian', flag: '🇮🇹' },
];

const ContentLangChooser: React.FC = () => {
  const { selectedLang, setSelectedLang } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (lang: typeof languages[0]) => {
    setSelectedLang(lang);
    setIsOpen(false);

    toast.success("display podcasts in " + lang.name);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="border border-gray-300 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center w-full rounded-md px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
          id="options-menu"
          onClick={toggleDropdown}
        >
          {selectedLang.flag} {selectedLang.name}
          <svg
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2"
          >
            <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div
            className="py-1 divide-y divide-gray-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {languages.map((lang) => (
              <a
                href="#"
                key={lang.code}
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageSelect(lang);
                }}
                className={`flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 ${selectedLang.code === lang.code ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                role="menuitem"
              >
                <span className="flex-shrink-0 h-6 w-6 mr-2">{lang.flag}</span>
                <span className="flex flex-col">{lang.name}</span>
              </a>
            ))}

          </div>


        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ContentLangChooser;