// app/[lang]/studyroom/page.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import MainLayout from "@/components/MainLayout";
import Navigation from '@/components/StudyRoom/Navigation';
import MainContent from '@/components/StudyRoom/MainContent';
import SubHeader from '@/components/StudyRoom/SubHeader';
import { useRouter } from 'next/router';

const StudyRoom: React.FC = () => {
  const router = useRouter();
  const { lang } = router.query;
  const [locale, setLocale] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      import(`@/locales/${lang}.json`).then(module => {
        setLocale(module.default);
      }).catch(error => {
        console.error(`Failed to load locale for ${lang}:`, error);
        import(`@/locales/en.json`).then(module => {
          setLocale(module.default);
        });
      });
    }
  }, [lang]);
  console.error(lang);
  const [content, setContent] = useState('Summary');
  const [audioLink, setAudioLink] = useState('');
  const [extraContent, setExtraContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');

  const handleButtonClick = useCallback((content: string) => {
    console.log(`Button clicked: ${content}`);
    setContent(content);
  }, []);

  const handleAudioSubmit = useCallback((link: string) => {
    console.log(`Audio link submitted: ${link}`);
    setAudioLink(link);
  }, []);

  const handleProcessClick = useCallback(() => {
    console.log('Process button clicked');
    setLoading(true);
    fetch('/testdata.json')
      .then(response => response.json())
      .then(data => {
        setExtraContent(JSON.stringify(data, null, 2));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading JSON data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleFetchResult = (result: string) => {
    setExtraContent(result);
  };

  const handleShowOriginalClick = useCallback(() => {
    const prompt = `请把这个文章翻译成中文，只要返回结果即可0: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  const handleTranslateClick = useCallback(() => {
    const prompt = `请把这段话翻译成中文，只要返回结果即可1: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  const handleKeyWordsClick = useCallback(() => {
    const prompt = `请提取这段话的重点词汇: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  const handleKeyGrammerClick = useCallback(() => {
    const prompt = `请提取这段话的重点语法: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  const handleRewriteArticleClick = useCallback(() => {
    const prompt = `请用重点词汇重组这篇文章: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  const handleQuestionsClick = useCallback(() => {
    const prompt = `请为这段话出题: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  const handleExportNotesClick = useCallback(() => {
    const prompt = `请导出这段话的笔记: ${extraContent}`;
    setPrompt(prompt);
  }, [extraContent]);

  useEffect(() => {
    console.log('Rendering StudyRoom component');
  }, []);

  console.log('Rendering StudyRoom with content:', content, 'and audioLink:', audioLink);

  if (!locale) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="flex h-screen bg-gray-900 text-white">
        <main className="flex-1 flex flex-col">
          <SubHeader
            onAudioSubmit={handleAudioSubmit}
            audioLink={audioLink}
            onProcessClick={handleProcessClick}
            onFetchResult={handleFetchResult}
            locale={locale} // 传递 locale 对象
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
              locale={locale} // 传递 locale 对象
            />
            <MainContent content={content} jsonDataContent={extraContent} loading={loading} error={error} prompt={prompt} locale={locale} />
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default StudyRoom;