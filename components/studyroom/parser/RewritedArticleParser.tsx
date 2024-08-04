import React from 'react';

interface ContentParserProps {
  content: string;
}

const ContentParser: React.FC<ContentParserProps> = ({ content }) => {
  let json;
  try {
    json = JSON.parse(content);
  } catch (e) {
    console.error('JSON Parsing Error:', e);
    return <div>Invalid JSON</div>;
  }

  if (!json || typeof json.content !== 'string') {
    return <div>No content available</div>;
  }

  return (
    <div className="prose lg:prose-lg">
      <p>{json.content}</p>
    </div>
  );
};

export default ContentParser;