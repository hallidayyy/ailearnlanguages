import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';

const StyledContent = styled.div`
    h1 {
        font-size: 1.2em;
        line-height: 1.5;
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
        setLoading(true);
        try {
            if (!translation) {
                setContent('no content');
                setLoading(false);
                return;
            }
            const jsonObject = JSON.parse(translation);
            const jsonContent = jsonObject['content'];
            if (typeof jsonContent !== 'string') {
                throw new Error('Content is not a valid string');
            }
            const html = marked(jsonContent);
            if (typeof html !== 'string') {
                throw new Error('Content is not a valid string');
            }
            setContent(html);
        } catch (error) {
            console.error('Error processing the content:', error);
            setError('Failed to parse and convert content');
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

    return (
        <StyledContent dangerouslySetInnerHTML={{ __html: content }} />
    );
};

export default TranslateParser;