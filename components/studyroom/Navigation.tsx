import React from 'react';

interface NavigationProps {
  onButtonClick: (content: string) => void;
  onShowOriginalClick: () => void;
  onTranslateClick: () => void;
  onKeyWordsClick: () => void;
  onKeyGrammerClick: () => void;
  onRewriteArticleClick: () => void;
  onQuestionsClick: () => void;
  onExportNotesClick: () => void;
  resultCache: {
    Original: string;
    Translate: string;
    KeyWords: string;
    KeyGrammer: string;
    RewriteArticle: string;
    Questions: string;
    ExportNotes: string;
  };
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
  resultCache 
}) => {
  return (
    <nav className="w-64 bg-gray-800 p-4">
      <ul className="space-y-2">
        <li>
          <button 
            onClick={onShowOriginalClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Show Original {resultCache.Original && '✅'}
          </button>
        </li>
        <li>
          <button 
            onClick={onTranslateClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Translate {resultCache.Translate && '✅'}
          </button>
        </li>
        <li>
          <button 
            onClick={onKeyWordsClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Key Words {resultCache.KeyWords && '✅'}
          </button>
        </li>
        <li>
          <button 
            onClick={onKeyGrammerClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Key Grammer {resultCache.KeyGrammer && '✅'}
          </button>
        </li>
        <li>
          <button 
            onClick={onRewriteArticleClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Rewrite Article {resultCache.RewriteArticle && '✅'}
          </button>
        </li>
        <li>
          <button 
            onClick={onQuestionsClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Questions {resultCache.Questions && '✅'}
          </button>
        </li>
        <li>
          <button 
            onClick={onExportNotesClick} 
            className="w-full text-left text-white p-2 rounded hover:bg-gray-700"
          >
            Export Notes {resultCache.ExportNotes && '✅'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;