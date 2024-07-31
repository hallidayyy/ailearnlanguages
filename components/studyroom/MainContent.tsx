// components/StudyRoom/MainContent.tsx
import React from 'react';

interface MainContentProps {
  content: string;
  jsonDataContent: string;
  loading?: boolean;
  error?: Error | null;
  prompt?: string; // 新增 prop
}

const MainContent: React.FC<MainContentProps> = ({ content, jsonDataContent, loading, error, prompt }) => {
  const { title, content: jsonContent } = jsonDataContent ? JSON.parse(jsonDataContent) : {};

  return (
    <section className="flex-1 p-4 bg-white text-black">
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : (
          <>
            <div>
            
              <h3 className="text-md font-bold">{title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap break-words">{jsonContent}</p>
            </div>
            {prompt && (
              <div>
                <h2 className="text-lg font-bold">提示词</h2>
                <p className="text-gray-600">{prompt}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MainContent;