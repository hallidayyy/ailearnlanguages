"use client";

import React, { useState, useCallback, useEffect } from 'react';
import SubHeader from '@/components/studyroom/SubHeader';
import Navigation from '@/components/studyroom/Navigation';
import MainContent from '@/components/studyroom/MainContent';
import { franc } from 'franc';

interface CreateCardProps {
  state: {
    content: string;
    audioLink: string;
    extraContent: string;
    loading: boolean;
    error: Error | null;
    prompt: string;
    resultCache: {
      Original: string;
      Translate: string;
      KeyWords: string;
      KeyGrammer: string;
      RewriteArticle: string;
      Questions: string;
      ExportNotes: string;
    };
    detectedLanguage: string;
    wordCount: number;
    link: string; // 添加 link 状态
    generatedTitle: string;
  };
  setState: React.Dispatch<React.SetStateAction<{
    content: string;
    audioLink: string;
    extraContent: string;
    loading: boolean;
    error: Error | null;
    prompt: string;
    resultCache: {
      Original: string;
      Translate: string;
      KeyWords: string;
      KeyGrammer: string;
      RewriteArticle: string;
      Questions: string;
      ExportNotes: string;
    };
    detectedLanguage: string;
    wordCount: number;
    link: string; // 添加 link 状态
    generatedTitle: string;
  }>>;
}

let indexStr: keyof typeof resultCache = "Original";
const CreateCard: React.FC<CreateCardProps> = ({ state, setState }) => {
  const { content, audioLink, extraContent, loading, error, prompt, detectedLanguage, wordCount, link, generatedTitle } = state;

  const [resultCache, setResultCache] = useState({
    Original: '',
    Translate: '',
    KeyWords: '',
    KeyGrammer: '',
    RewriteArticle: '',
    Questions: '',
    ExportNotes: '',
  });

  const handleButtonClick = useCallback((content: string) => {
    setState(prevState => ({ ...prevState, content }));
  }, [setState]);

  const handleAudioSubmit = useCallback((link: string) => {
    setState(prevState => ({ ...prevState, audioLink: link }));
  }, [setState]);

  const handleLinkChange = useCallback((link: string) => {
    setState(prevState => ({ ...prevState, link }));
  }, [setState]);

  const handleProcessClick = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    try {
      const response = await fetch('/testdata.json');
      const data = await response.json();
      const text = JSON.stringify(data, null, 2);
      const detectedLanguage = franc(text);
      const wordCount = text.split(/\s+/).length;
      const prompt = `最简短的总结标题: ${text}`;
      const generatedTitle = await callDeepSeekAPISimple(prompt);

      setResultCache(prevCache => ({ ...prevCache, Original: text }));
      setState(prevState => ({
        ...prevState,
        extraContent: text,
        detectedLanguage,
        wordCount,
        generatedTitle,
        loading: false
      }));
    } catch (error) {
      setState(prevState => ({ ...prevState, error, loading: false }));
    }
  }, [setState, extraContent]);

  const handleFetchResult = (result: string) => {
    setState(prevState => ({ ...prevState, extraContent: result }));
  };

  async function callDeepSeekAPISimple(prompt: string): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      return '';
    }
  }

  const callDeepSeekAPI = useCallback(async (prompt: string, handleFunctionName: keyof typeof resultCache) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setResultCache(prevCache => ({ ...prevCache, [handleFunctionName]: data.choices[0].message.content }));
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
    }
  }, []);

  const handleShowOriginalClick = useCallback(() => {
    setState(prevState => ({ ...prevState, prompt }));
    setResultCache(prevCache => ({ ...prevCache, Original: extraContent }));
    indexStr = "Original";
  }, [extraContent, setState]);

  const handleTranslateClick = useCallback(() => {
    const prompt = `请把这段话翻译成中文: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'Translate');
    indexStr = "Translate";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleKeyWordsClick = useCallback(() => {
    const prompt = `请提取这段话的重点词汇，并对每个单词进行讲解: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'KeyWords');
    indexStr = "KeyWords";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleKeyGrammerClick = useCallback(() => {
    const prompt = `请提取这段话的重点语法，并对每个语法点进行讲解: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'KeyGrammer');
    indexStr = "KeyGrammer";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleRewriteArticleClick = useCallback(() => {
    const prompt = `请用重点词汇重组这篇文章: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'RewriteArticle');
    indexStr = "RewriteArticle";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleQuestionsClick = useCallback(() => {
    const prompt = `请为这段话出题: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'Questions');
    indexStr = "Questions";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleExportNotesClick = useCallback(() => {
    const prompt = `请导出这段话的笔记: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'ExportNotes');
    indexStr = "ExportNotes";
  }, [extraContent, setState, callDeepSeekAPI]);

  useEffect(() => {
    console.log('Rendering CreateCard component');
  }, []);

  console.log('Rendering CreateCard with content:', content, 'and audioLink:', audioLink);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <main className="flex-1 flex flex-col">
        <SubHeader
          onAudioSubmit={handleAudioSubmit}
          audioLink={audioLink}
          onProcessClick={handleProcessClick}
          onFetchResult={handleFetchResult}
          onLinkChange={handleLinkChange}
          link={link}
          resultCache={resultCache}
          detectedLanguage={detectedLanguage}
          wordCount={wordCount}
          generatedTitle={generatedTitle}
        />
        <div className="flex-1 flex">
          <Navigation
            onButtonClick={handleButtonClick}
            onShowOriginalClick={handleShowOriginalClick}
            onTranslateClick={handleTranslateClick}
            onKeyWordsClick={handleKeyWordsClick}
            onKeyGrammerClick={handleKeyGrammerClick}
            onRewriteArticleClick={handleRewriteArticleClick}
            onQuestionsClick={handleQuestionsClick}
            onExportNotesClick={handleExportNotesClick}
            resultCache={resultCache}
          />
          <MainContent
            content={content}
            jsonDataContent={extraContent}
            loading={loading}
            error={error}
            prompt={prompt}
            result={prompt ? resultCache[indexStr] : ''}
            generatedTitle={generatedTitle}
          />
        </div>
      </main>
    </div>
  );
};

export default CreateCard;