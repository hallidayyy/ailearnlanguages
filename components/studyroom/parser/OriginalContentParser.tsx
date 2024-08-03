import React from 'react';

const OriginalContentParser: React.FC<{ content: string }> = ({ content }) => {
  console.log('Content Received:', content); // Log the raw content

  const cleanedContent = content.replace(/[\r\n]+/g, ' ');


  // Check if the content is a valid JSON string
  if (!content.trim().startsWith('{') || !content.trim().endsWith('}')) {
    return <div>Invalid JSON</div>;
  }

  let json;
  try {
    json = JSON.parse(cleanedContent);
  } catch (e) {
    console.error('JSON Parsing Error:', e);
    return <div>Invalid JSON</div>;
  }

  console.log('Parsed JSON:', json); // Log the parsed JSON

  if (!json || typeof json.content !== 'string') {
    return <div>No content available</div>;
  }

  const paragraphs = json.content.split('\n\n').filter(paragraph => paragraph.trim() !== '');

  return (
    <div>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};

export default OriginalContentParser;
