import React, { useEffect, useState } from 'react';
import { marked } from 'marked'; // Markdown 转换库
import styled from 'styled-components';

const StyledContent = styled.div`
    h1 {
        font-size: 1.2em;
        line-height: 1.5; /* 调整行间距 */
    }
`;

interface OriginalParserProps {
    original_text: string;
}

const OriginalParser: React.FC<OriginalParserProps> = ({ original_text }) => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        try {
            // 解析 JSON 字符串
            const jsonObject = JSON.parse(original_text);

            // 提取 content 的值
            const jsonContent = jsonObject['content'];
            if (typeof jsonContent !== 'string') {
                throw new Error('Content is not a valid string');
            }

            // 将 Markdown 转换为 HTML
            const html = marked(jsonContent);
            setContent(html);
        } catch (error) {
            console.error('Error processing the content:', error);
            setError('Failed to parse and convert content');
        } finally {
            setLoading(false);
        }
    }, [original_text]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <StyledContent dangerouslySetInnerHTML={{ __html: content }} />;
};

export default OriginalParser;