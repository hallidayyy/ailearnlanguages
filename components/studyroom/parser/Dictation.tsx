import React, { useState } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import {DictationNote} from '@/components/studyroom/DictationNote'

const Container = styled.div<{ isSplit: boolean }>`
    display: flex;
    flex-direction: ${({ isSplit }) => (isSplit ? 'row' : 'column')};
    align-items: ${({ isSplit }) => (isSplit ? 'flex-start' : 'center')};
    justify-content: ${({ isSplit }) => (isSplit ? 'space-between' : 'center')};
    width: 100%;
    height: 100vh;
`;

const LeftPane = styled.div<{ isSplit: boolean }>`
    width: ${({ isSplit }) => (isSplit ? '50%' : '100%')};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const RightPane = styled.div`
    width: 50%;
    height: 100%;
    padding: 20px;
    overflow-y: auto;
`;

const Textarea = styled.textarea<{ isSplit: boolean }>`
    width: ${({ isSplit }) => (isSplit ? '90%' : '100%')};
    height: ${({ isSplit }) => (isSplit ? '80%' : '90%')};
    padding: 10px;
    font-size: 1em;
    line-height: 1.5;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
`;

const Button = styled.button`
    width: 150px;
    padding: 10px;
    font-size: 1em;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;

    &:hover {
        background-color: #0056b3;
    }
`;

const StyledContent = styled.div`
    h1 {
        font-size: 1.2em;
        line-height: 1.5; /* 调整行间距 */
    }
    /* 你可以在这里添加更多的样式来控制 Markdown 的渲染 */
`;

const Dictation: React.FC = () => {
    const [inputText, setInputText] = useState<string>(''); // 用于存储用户输入
    const [loading, setLoading] = useState<boolean>(false);
    const [isSplit, setIsSplit] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');

    const handleCheck = () => {
        setLoading(true);

        fetch('/api/dictation-analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: inputText }), // 将用户输入作为请求体传递给后端
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 将返回的 Markdown 内容转换为 HTML
            const htmlContent = marked(data.analysis);
            setContent(htmlContent);
            setIsSplit(true); // 触发页面分割
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching analysis:', error);
            setContent('<p>Failed to analyze the content</p>');
            setIsSplit(true);
            setLoading(false);
        });
    };

    return (
        <Container isSplit={isSplit}>
            <LeftPane isSplit={isSplit}>
                <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="请输入文本..."
                    isSplit={isSplit}
                />
                {/* <DictationNote /> */}
                <Button onClick={handleCheck} disabled={loading}>
                    {loading ? 'Checking...' : '检查'}
                </Button>
            </LeftPane>

            {isSplit && (
                <RightPane>
                    <StyledContent dangerouslySetInnerHTML={{ __html: content }} />
                </RightPane>
            )}
        </Container>
    );
};

export default Dictation;