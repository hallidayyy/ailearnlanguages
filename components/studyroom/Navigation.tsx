import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { getDictionary } from '@/lib/i18n';

interface NavigationProps {
  onButtonClick: (content: string) => void;
  onShowOriginalClick: () => void;
  onTranslateClick: () => void;
  onKeyWordsClick: () => void;
  onKeyGrammerClick: () => void;
  onRewriteArticleClick: () => void;
  onQuestionsClick: () => void;
  onExportNotesClick: () => void;
  resultCache?: {
    Original: string;
    Translate: string;
    KeyWords: string;
    KeyGrammer: string;
    RewriteArticle: string;
    Questions: string;
    ExportNotes: string;
  };
  className?: string; // 允许外部传入类名
}

const Navigation: React.FC<NavigationProps> = ({
  onButtonClick,
  onShowOriginalClick,
  onTranslateClick,
  onKeyWordsClick,
  onKeyGrammerClick,
  onRewriteArticleClick,
  onQuestionsClick,
  onExportNotesClick,
  resultCache = {
    Original: '',
    Translate: '',
    KeyWords: '',
    KeyGrammer: '',
    RewriteArticle: '',
    Questions: '',
    ExportNotes: '',
  },
  className = '', // 默认值为空字符串
}) => {
  const { lang, user } = useContext(AppContext);
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

  return (
    <div className={`flex h-screen flex-col justify-between border-e bg-white ${className}`}>
      <div className="px-4 py-6">
        <ul className="space-y-1">
          <li>
            <button
              onClick={onShowOriginalClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors text-left duration-200 ease-in-out hover:bg-gray-100 ${resultCache.Original ? 'text-gray-700' : 'text-gray-500'}`}
            >
              show original
            </button>
          </li>

          <li>
            <button
              onClick={onTranslateClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors text-left duration-200 ease-in-out hover:bg-gray-100 ${resultCache.Translate ? 'text-gray-700' : 'text-gray-500'}`}
            >
              translate
            </button>
          </li>

          <li>
            <button
              onClick={onKeyWordsClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors text-left duration-200 ease-in-out hover:bg-gray-100 ${resultCache.KeyWords ? 'text-gray-700' : 'text-gray-500'}`}
            >
              key words
            </button>
          </li>

          <li>
            <button
              onClick={onKeyGrammerClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors text-left duration-200 ease-in-out hover:bg-gray-100 ${resultCache.KeyGrammer ? 'text-gray-700' : 'text-gray-500'}`}
            >
              key grammar
            </button>
          </li>

          <li>
            <button
              onClick={onRewriteArticleClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors text-left duration-200 ease-in-out hover:bg-gray-100 ${resultCache.RewriteArticle ? 'text-gray-700' : 'text-gray-500'}`}
            >
              rewrite article
            </button>
          </li>

          <li>
            <button
              onClick={onQuestionsClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors text-left duration-200 ease-in-out hover:bg-gray-100 ${resultCache.Questions ? 'text-gray-700' : 'text-gray-500'}`}
            >
              questions
            </button>
          </li>

          {/* <li>
            <button
              onClick={onExportNotesClick}
              className={`block w-full px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-gray-100 ${
                resultCache.ExportNotes ? 'text-gray-700' : 'text-gray-500'
              }`}
            >
              Export Notes {resultCache.ExportNotes && '✓'}
            </button>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Navigation;