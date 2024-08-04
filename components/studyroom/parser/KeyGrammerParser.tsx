import React from 'react';

interface KeyGrammer {
  grammer: string;
  description: string;
  example: string;
}

interface KeyGrammerParserProps {
  content: string;
}

const KeyGrammerParser: React.FC<KeyGrammerParserProps> = ({ content }) => {
  let json;
  try {
    json = JSON.parse(content);
  } catch (e) {
    console.error('JSON Parsing Error:', e);
    return <div>Invalid JSON</div>;
  }

  if (!json || !Array.isArray(json.keygrammer)) {
    return <div>No key grammers available</div>;
  }

  const keyGrammers: KeyGrammer[] = json.keygrammer;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grammar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Example
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {keyGrammers.map((keyGrammer, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{keyGrammer.grammer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{keyGrammer.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{keyGrammer.example}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeyGrammerParser;