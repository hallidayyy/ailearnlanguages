import React, { useEffect, useState } from 'react';
import { marked } from 'marked'; // Markdown 转换库
import styled from 'styled-components';

const StyledContent = styled.div`
    h1 {
        font-size: 1.2em;
        line-height: 1.5; /* 调整行间距 */
    }
`;

const OriginalParser: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const markdownUrl = '/test/translation.md'; // 替换为实际 Markdown 文件的路径

    useEffect(() => {
        fetch(markdownUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const html = marked(text) as string; // 将 Markdown 转换为 HTML，并断言为字符串
                setContent(html);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching markdown file:', error);
                setError('Failed to load content');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <StyledContent dangerouslySetInnerHTML={{ __html: content }} />;
};

export default OriginalParser;