"use client";

import React, { useState, useCallback, useEffect } from 'react';
import SubHeader from '@/components/studyroom/SubHeader';
import Navigation from '@/components/studyroom/Navigation';
import MainContent from '@/components/studyroom/MainContent';
import { useContext } from "react";
import AppContext from "@/contexts/AppContext";

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
    }
  }>>;
}
let indexStr: string = "Orginal";
const CreateCard: React.FC<CreateCardProps> = ({ state, setState }) => {
  const { content, audioLink, extraContent, loading, error, prompt } = state;


  //const { user } = useContext(AppContext);

  // 定义 resultCache 变量
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

  const handleProcessClick = useCallback(() => {
    setState(prevState => ({ ...prevState, loading: true }));
    fetch('/testdata.json')
      .then(response => response.json())
      .then(data => {
        setState(prevState => ({ ...prevState, extraContent: JSON.stringify(data, null, 2), loading: false }));
      })
      .catch(error => {
        setState(prevState => ({ ...prevState, error, loading: false }));
      });
  }, [setState]);

  const handleFetchResult = (result: string) => {
    setState(prevState => ({ ...prevState, extraContent: result }));
  };

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
    const prompt = `handleShowOriginalClick: 请把这个文章翻译成中文，只要返回结果即可0: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    //callDeepSeekAPI(prompt, 'Original');
    resultCache["Original"] = extraContent;
    indexStr = "Original";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleTranslateClick = useCallback(() => {
    const prompt = `handleTranslateClick: 请把这段话翻译成中文，只要返回结果即可1: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'Translate');
    indexStr = "Translate";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleKeyWordsClick = useCallback(() => {
    const prompt = `handleKeyWordsClick: 请提取这段话的重点词汇: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'KeyWords');
    indexStr = "KeyWords";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleKeyGrammerClick = useCallback(() => {
    const prompt = `handleKeyGrammerClick: 请提取这段话的重点语法: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'KeyGrammer');
    indexStr = "KeyGrammer";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleRewriteArticleClick = useCallback(() => {
    const prompt = `handleRewriteArticleClick: 请用重点词汇重组这篇文章: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'RewriteArticle');
    indexStr = "RewriteArticle";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleQuestionsClick = useCallback(() => {
    const prompt = `handleQuestionsClick: 请为这段话出题: ${extraContent}`;
    setState(prevState => ({ ...prevState, prompt }));
    callDeepSeekAPI(prompt, 'Questions');
    indexStr = "Questions";
  }, [extraContent, setState, callDeepSeekAPI]);

  const handleExportNotesClick = useCallback(() => {
    const prompt = `handleExportNotesClick: 请导出这段话的笔记: ${extraContent}`;
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
          resultCache={resultCache}
          link={audioLink}
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

            result={prompt ? resultCache[indexStr] : ''} // 传递 result
          />
        </div>
      </main>
    </div>
  );
};

export default CreateCard;