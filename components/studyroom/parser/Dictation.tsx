
import styled from 'styled-components';
import { marked } from 'marked';
import { TailSpin } from 'react-loader-spinner';
import { AppContext } from '@/contexts/AppContext';
import React, { useState, useEffect, useContext, useRef } from 'react';

const Container = styled.div<{ isSplit: boolean }>`

    display: flex;
    flex-direction: ${({ isSplit }) => (isSplit ? 'row' : 'column')};
    align-items: ${({ isSplit }) => (isSplit ? 'flex-start' : 'center')};
    justify-content: ${({ isSplit }) => (isSplit ? 'space-between' : 'center')};
    width: 100%;
    height: 48vh;
`;

const LeftPane = styled.div<{ isSplit: boolean }>`
    width: ${({ isSplit }) => (isSplit ? '50%' : '100%')};
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const RightPane = styled.div`
    width: 50%;
    height: 90%;
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
        line-height: 3;
    }
    /* 你可以在这里添加更多的样式来控制 Markdown 的渲染 */
`;

const LoadingIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Dictation: React.FC = () => {
    const [inputText, setInputText] = useState<string>(''); // 用于存储用户输入
    const [loading, setLoading] = useState<boolean>(false);
    const [isSplit, setIsSplit] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');
    const { lang, user } = useContext(AppContext);

    const handleCheck = () => {
        console.log("user_lang:" + lang)
        setLoading(true);
        setContent(''); // 清空之前的内容

        fetch('/api/dictation-analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text1: 'The quick brown fox jumps over the lazy dog. Every morning, the sun rises in the east and sets in the west. She sells seashells by the seashore. This sentence is a common example used to demonstrate typing skills. Practicing typing can help you become more efficient and accurate.',
                text2: inputText,
                user_lang: lang
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const json = JSON.parse(data);
                handleJson(json);
                setLoading(false);
                setIsSplit(true); // 触发页面分割
            })
            .catch(error => {
                console.error('Error fetching analysis:', error);
                setContent('<p>Failed to analyze the content</p>');
                setIsSplit(true);
                setLoading(false);
            });
    };

    const handleJson = (json: any) => {
        let markdownContent = '';
        // console.log("json:", JSON.stringify(json, null, 2)); // 输出 JSON 内容
        // 处理 differences
        if (json.differences && json.differences.difference) {
            markdownContent += '### differences:\n';
            json.differences.difference.forEach((diff: any) => {
                markdownContent += `**original text:** ${diff.original}\n\n`;
                markdownContent += `**mistake:** ${diff.wrong}\n\n`;
                markdownContent += `**reason:** ${diff.reason}\n\n`;
            });
        }

        // 处理 summary
        if (json.summary) {
            markdownContent += `### summary:\n${json.summary}\n`;
        }
        console.log(markdownContent);
        setContent(prevContent => prevContent + marked(markdownContent));
    };

    return (
        <Container isSplit={isSplit}>
            <LeftPane isSplit={isSplit}>
                <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="press the spacebar on your keyboard to play/pause, enter your dictation here and click check"
                    isSplit={isSplit}
                />
                <Button onClick={handleCheck} disabled={loading}>
                    {loading ? 'checking...' : 'check'}
                </Button>
            </LeftPane>

            {isSplit && (
                <RightPane>
                    {loading ? (
                        <LoadingIndicator>
                            <TailSpin color="#007bff" height={80} width={80} />
                        </LoadingIndicator>
                    ) : (
                        <StyledContent dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                </RightPane>
            )}
        </Container>
    );
};

export default Dictation;