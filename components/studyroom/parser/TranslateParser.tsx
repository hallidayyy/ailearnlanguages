import React from 'react';

const TranslateParser: React.FC<{ content: string }> = ({ content }) => {
    // Check if the content is a valid JSON string
    if (!isValidJsonString(content)) {
        return <div>Invalid JSON</div>;
    }

    let json;
    try {
        json = JSON.parse(content);
    } catch (e) {
        console.error('JSON Parsing Error:', e);
        return <div>Invalid JSON</div>;
    }

    if (!json || typeof json.translation !== 'string') {
        return <div>No translation available</div>;
    }

    const paragraphs = json.translation.split('\n\n').filter(paragraph => paragraph.trim() !== '');

    return (
        <div>
            {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    );
};

const isValidJsonString = (str: string): boolean => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

export default TranslateParser;