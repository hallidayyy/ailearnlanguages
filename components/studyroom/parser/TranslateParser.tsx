import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marked } from 'marked'; // Markdown 转换库
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
        setLoading(true);
        try {
            // 解析 JSON 字符串
            const jsonObject = JSON.parse(translation);

            // 提取 content 的值
            const jsonContent = jsonObject['content'];
            if (typeof jsonContent !== 'string') {
                throw new Error('Content is not a valid string');
            }

            // 将 Markdown 转换为 HTML
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

    const exportAsPDF = () => {
        const input = document.getElementById('content-to-export');
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('translation.pdf');
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <button onClick={exportAsPDF}>Export as PDF</button>
            <StyledContent id="content-to-export" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default TranslateParser;