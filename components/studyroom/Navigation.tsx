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
  resultCache?: {
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
  resultCache = {
    Original: '',
    Translate: '',
    KeyWords: '',
    KeyGrammer: '',
    RewriteArticle: '',
    Questions: '',
    ExportNotes: '',
  },
}) => {
  return (













    <div className="flex h-screen flex-col justify-between border-e bg-white">
      <div className="px-4 py-6">


        <ul className="mt-6 space-y-1">
          <li>
            <button
              onClick={onShowOriginalClick}
              className="block w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Show Original {resultCache.Original && '✓'}
            </button>
          </li>

          <li>
            <button
              onClick={onTranslateClick}
              className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
            >
              Translate {resultCache.Translate && '✓'}
            </button>
          </li>

          <li>
            <button
              onClick={onKeyWordsClick}
              className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
            >
              Key Words {resultCache.KeyWords && '✓'}
            </button>
          </li>

          <li>
            <button
              onClick={onKeyGrammerClick}
              className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
            >
              Key Grammar {resultCache.KeyGrammer && '✓'}
            </button>
          </li>

          <li>
            <button
              onClick={onRewriteArticleClick}
              className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
            >
              Rewrite Article {resultCache.RewriteArticle && '✓'}
            </button>
          </li>

          <li>
            <button
              onClick={onQuestionsClick}
              className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
            >
              Questions {resultCache.Questions && '✓'}
            </button>
          </li>

          {/* <li>
            <button
              onClick={onExportNotesClick}
              className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200"
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