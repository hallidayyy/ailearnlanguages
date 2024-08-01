import React from 'react';

interface MainContentProps {
  content: string;
  jsonDataContent: string;
  loading?: boolean;
  error?: Error | null;
  prompt?: string;
  result?: string; // 新增 prop
  generatedTitle: string;
}

const MainContent: React.FC<MainContentProps> = ({ content, jsonDataContent, loading, error, prompt, generatedTitle, result }) => {
  const parsedData = jsonDataContent ? JSON.parse(jsonDataContent) : { title: '', content: '' };
  const parseTitle = generatedTitle ? JSON.parse(generatedTitle):{summary:''};
  return (
    <section className="flex-1 p-4 bg-white text-black w-full"> {/* 设置宽度为100% */}
      <div className="space-y-4 w-full"> {/* 确保内部 div 也占据全部宽度 */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : (
          <>
            <div className="w-full"> {/* 确保每个 div 占据全部宽度 */}
              <h1 className="text-md font-bold">{parseTitle.summary}</h1>
            <br></br>
              <p className="text-black whitespace-pre-wrap break-words">{parsedData.content}</p>
            </div>
          
            {result && (
              <div className="w-full"> {/* 确保每个 div 占据全部宽度 */}
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