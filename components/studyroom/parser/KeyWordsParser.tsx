import React from 'react';

interface Keyword {
  word: string;
  translation: string;
}

interface KeywordsParserProps {
  content: string;
}

const KeywordsParser: React.FC<KeywordsParserProps> = ({ content }) => {
  let json;
  try {
    json = JSON.parse(content);
  } catch (e) {
    console.error('JSON Parsing Error:', e);
    return <div>Invalid JSON</div>;
  }

  if (!json || !Array.isArray(json.keywords)) {
    return <div>No keywords available</div>;
  }

  const keywords: Keyword[] = json.keywords;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              word
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
              translation
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {keywords.map((keyword, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{keyword.word}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{keyword.translation}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordsParser;