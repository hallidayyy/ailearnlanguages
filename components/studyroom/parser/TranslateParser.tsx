import React from 'react';

const TranslateParser: React.FC<{ content: string }> = ({ content }) => {

    console.log("translate: "+content);
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

    // Check if json.translation exists and is a string
    if (!json.translation || typeof json.translation !== 'string') {
        return <div>No translation available</div>;
    }

    const paragraphs = json.translation.split('\n\n').filter((paragraph: string) => paragraph.trim() !== '');

    return (
        <div>
            {paragraphs.map((paragraph: string, index: number) => (
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