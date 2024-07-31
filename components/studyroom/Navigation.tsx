// components/Navigation.tsx
import React from 'react';
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onButtonClick: (funcName: string) => void;
  onShowOriginalClick: () => void;
  onTranslateClick: () => void;
  onKeyWordsClick: () => void;
  onKeyGrammerClick: () => void;
  onRewriteArticleClick: () => void;
  onQuestionsClick: () => void;
  onExportNotesClick: () => void;
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
}) => {
  const buttons = [
    { name: '显示原文', onClick: onShowOriginalClick },
    { name: '翻译', onClick: onTranslateClick },
    { name: '重点词汇', onClick: onKeyWordsClick },
    { name: '重点语法', onClick: onKeyGrammerClick },
    { name: '重点词汇重组文章', onClick: onRewriteArticleClick },
    { name: '出题', onClick: onQuestionsClick },
    { name: '导出笔记', onClick: onExportNotesClick },
  ];

  return (
    <nav className="w-48 bg-white p-4">
      {buttons.map((btn, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full text-left text-black hover:bg-gray-200"
          onClick={typeof btn === 'string' ? () => onButtonClick(btn) : btn.onClick}
        >
          {typeof btn === 'string' ? btn : btn.name}
        </Button>
      ))}
    </nav>
  );
};

export default Navigation;