import React from 'react';
import OriginalContentParser from "@/components/studyroom/parser/OriginalContentParser";
import TranslateParser from "@/components/studyroom/parser/TranslateParser";
import KeywordsParser from './parser/KeyWordsParser';
import KeyGrammerParser from './parser/KeyGrammerParser';
import RewritedArticleParser from "./parser/RewritedArticleParser"
import QuestionsParser from './parser/QuestionsParser';
import Dictation from './parser/Dictation';




interface MainContentProps {
  resultCache: {
    Original: string;
    Translate: string;
    KeyWords: string;
    KeyGrammer: string;
    RewriteArticle: string;
    Questions: string;
    ExportNotes: string;
  };
  indexStr: keyof MainContentProps['resultCache']; // 明确指定类型
  className?: string; // 添加 className 属性
}

const MainContent: React.FC<MainContentProps> = ({ resultCache, indexStr, className }) => {
  const renderComponent = () => {
    switch (indexStr) {
      case 'Original':
        return <OriginalContentParser content={resultCache.Original} />;
      case 'Translate':
        return <TranslateParser content={resultCache.Translate} />;
      case 'KeyWords':
        return <KeywordsParser content={resultCache.KeyWords} />;
      case 'KeyGrammer':
        return <KeyGrammerParser content={resultCache.KeyGrammer} />;
      case 'RewriteArticle':
        return <RewritedArticleParser content={resultCache.RewriteArticle} />;
      case 'Questions':
        return <QuestionsParser content={resultCache.Questions} />;
      case 'ExportNotes':
        return <OriginalContentParser content={resultCache.ExportNotes} />;
        case 'Dictation':
          return <Dictation  />;
      default:
        return <OriginalContentParser content={resultCache.Original} />;
    }
  };


  return (
    <div className={className}>
      {renderComponent()}
    </div>
  );
};

export default MainContent;