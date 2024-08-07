import React from 'react';

const OriginalContentParser: React.FC<{ content: string }> = ({ content }) => {
  console.log('Content Received:', content); // Log the raw content

  // 清理内容中的多余换行符
  const cleanedContent = content.replace(/[\r\n]+/g, ' ');

  // 检查内容是否为有效的 JSON 字符串
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

  // 检查解析后的 JSON 是否包含有效的内容
  if (!json || typeof json.content !== 'string') {
    return <div>No content available</div>;
  }

  // 将内容按段落分割，并去除空段落
  const paragraphs = json.content.split('\n\n').filter((paragraph: string) => paragraph.trim() !== '');

  return (
    <div>
      {paragraphs.map((paragraph: string, index: number) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};

export default OriginalContentParser;