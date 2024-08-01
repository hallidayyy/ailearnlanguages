"use client";

import React, { useState, useEffect } from 'react';
import SubHeader from '@/components/studyroom/SubHeaderForView';
import Navigation from '@/components/studyroom/Navigation';
import MainContent from '@/components/studyroom/MainContent';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径

interface ViewCardProps {
  id: string;
}

interface CardData {
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
  link: string;
  generatedTitle: string;
}

const ViewCard: React.FC<ViewCardProps> = ({ id }) => {
  const [cardData, setCardData] = useState<CardData>({
    content: '',
    audioLink: '',
    extraContent: '',
    loading: true,
    error: null,
    prompt: '',
    resultCache: {
      Original: '',
      Translate: '',
      KeyWords: '',
      KeyGrammer: '',
      RewriteArticle: '',
      Questions: '',
      ExportNotes: '',
    },
    detectedLanguage: '',
    wordCount: 0,
    link: '',
    generatedTitle: '',
  });

  const [indexStr, setIndexStr] = useState<keyof typeof cardData.resultCache>('Original');

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const supabase = await getDb();
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setCardData({
          content: '',
          audioLink: data.link,
          extraContent: data.original,
          loading: false,
          error: null,
          prompt: '',
          resultCache: {
            Original: data.original,
            Translate: data.translation,
            KeyWords: data.keywords,
            KeyGrammer: data.keygrammer,
            RewriteArticle: data.rewritedarticle,
            Questions: data.questions,
            ExportNotes: data.notes,
          },
          detectedLanguage: '',
          wordCount: data.wordcount,
          link: data.link,
          generatedTitle: data.generatedtitle,
        });
      } catch (error) {
        setCardData(prevState => ({ ...prevState, error: error as Error, loading: false }));
      }
    };

    fetchCardData();
  }, [id]);

  const handleButtonClick = (content: string) => {
    setCardData(prevState => ({ ...prevState, content }));
  };

  const handleShowOriginalClick = () => {
    setIndexStr('Original');
  };

  const handleTranslateClick = () => {
    setIndexStr('Translate');
  };

  const handleKeyWordsClick = () => {
    setIndexStr('KeyWords');
  };

  const handleKeyGrammerClick = () => {
    setIndexStr('KeyGrammer');
  };

  const handleRewriteArticleClick = () => {
    setIndexStr('RewriteArticle');
  };

  const handleQuestionsClick = () => {
    setIndexStr('Questions');
  };

  const handleExportNotesClick = () => {
    setIndexStr('ExportNotes');
  };

  const { content, audioLink, extraContent, loading, error, prompt, resultCache, detectedLanguage, wordCount, link, generatedTitle } = cardData;

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      <main className="flex-1 flex flex-col">
        <SubHeader
          onAudioSubmit={() => { }}
          audioLink={audioLink}
          onProcessClick={() => { }}
          onFetchResult={() => { }}
          onLinkChange={() => { }}
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
            result={resultCache[indexStr]}
            generatedTitle={generatedTitle}
          />
        </div>
      </main>
    </div>
  );
};

export default ViewCard;