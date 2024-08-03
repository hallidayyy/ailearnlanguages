import React, { useState } from 'react';
import OriginalContentParser from "@/components/studyroom/parser/OriginalContentParser";
import TranslateParser from "@/components/studyroom/parser/TranslateParser";

interface MainContentProps {
  content: string;
  jsonDataContent: string;
  loading?: boolean;
  error?: Error | null;
  prompt?: string;
  result?: string; // 新增 prop
  generatedTitle: string;
  parserName: string;
}

const MainContent: React.FC<MainContentProps> = ({
  content,
  jsonDataContent,
  loading,
  error,
  prompt,
  result,
  generatedTitle,
  parserName,
}) => {
  const [currentComponent, setCurrentComponent] = useState<string>('Original');
  console.log("content in maincontent: "+content);
  const renderComponent = () => {
    switch (currentComponent) {
      case 'Original':
        return <OriginalContentParser content={content} />;
      case 'Translate':
        return <TranslateParser content={content} />;
      case 'KeyWords':
        return <OriginalContentParser content={content} />;
      // 添加其他组件的渲染逻辑
      default:
        return <OriginalContentParser content={content} />;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {renderComponent()}
    </div>
  );
};

export default MainContent;