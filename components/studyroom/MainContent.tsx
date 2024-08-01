import React from 'react';

interface MainContentProps {
  content: string;
  jsonDataContent: string;
  loading?: boolean;
  error?: Error | null;
  prompt?: string;
  result?: string; // 新增 prop
}

const MainContent: React.FC<MainContentProps> = ({ content, jsonDataContent, loading, error, prompt, result }) => {
  const parsedData = jsonDataContent ? JSON.parse(jsonDataContent) : { title: '', content: '' };

  return (
    <section className="flex-1 p-4 bg-white text-black w-full"> {/* 设置宽度为100% */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : (
          <>
            <div>
              <h3 className="text-md font-bold">{parsedData.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap break-words">{parsedData.content}</p>
            </div>
            {prompt && (
              <div>
                <h2 className="text-lg font-bold">提示词</h2>
                <p className="text-gray-600">{prompt}</p>
              </div>
            )}
            {result && (
              <div>
                <h2 className="text-lg font-bold">Result:</h2>
                <p className="text-gray-600">{result}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MainContent;