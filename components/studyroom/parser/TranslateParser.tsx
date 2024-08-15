import React, { useEffect, useState } from 'react';
import { marked } from 'marked'; // Markdown 转换库
import styled from 'styled-components';

const StyledContent = styled.div`
    h1 {
        font-size: 1.2em;
        line-height: 1.5; /* 调整行间距 */
    }
`;

interface TranslateParserProps {
    translation: string;
}

const TranslateParser: React.FC<TranslateParserProps> = ({ translation }) => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const html = marked(translation) as string; // 将 Markdown 转换为 HTML，并断言为字符串
                setContent(html);
        } catch (error) {
            console.error('Error parsing translation:', error);
            setError('Failed to parse translation');
        } finally {
                setLoading(false);
        }
    }, [translation]);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <StyledContent dangerouslySetInnerHTML={{ __html: content }} />;
};

export default TranslateParser;