import React, { useState, useEffect } from 'react';
import SubHeader from '@/components/studyroom/SubHeaderForView';
import Navigation from '@/components/studyroom/Navigation';
import MainContent from '@/components/studyroom/MainContent';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径

interface ViewCardProps {
  id: string;
}

interface CardData {
  id: number;
  userid: number;
  uuid: string;
  link: string;
  likes: number;
  create_at: string;
  original: string;
  translation: string;
  keywords: string;
  keygrammer: string;
  rewritedarticle: string;
  questions: string;
  notes: string;
  wordcount: number;
  lang: string;
  genertedtitle: string;
  loading: boolean;
  error: Error | null;
}

const ViewCard: React.FC<ViewCardProps> = ({ id }) => {
  const [cardData, setCardData] = useState<CardData>({
    id: 0,
    userid: 0,
    uuid: '',
    link: '',
    likes: 0,
    create_at: '',
    original: '',
    translation: '',
    keywords: '',
    keygrammer: '',
    rewritedarticle: '',
    questions: '',
    notes: '',
    wordcount: 0,
    lang: '',
    genertedtitle: '',
    loading: true,
    error: null,
  });

  const [indexStr, setIndexStr] = useState<keyof typeof cardData>('original');

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        console.log("Fetching card data for id:", id);
        const supabase = await getDb();
        console.log("Database connection established");
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching card data:", error);
          throw error;
        }
        console.log("Data fetched successfully:", data);

        const updatedCardData: CardData = {
          id: data.id,
          userid: data.userid,
          uuid: data.uuid,
          link: data.link,
          likes: data.likes,
          create_at: data.create_at,
          original: data.original || '',
          translation: data.translation || '',
          keywords: data.keywords || '',
          keygrammer: data.keygrammer || '',
          rewritedarticle: data.rewritedarticle || '',
          questions: data.questions || '',
          notes: data.notes || '',
          wordcount: parseInt(data.wordcount) || 0,
          lang: data.lang || '',
          genertedtitle: data.genertedtitle || '',
          loading: false,
          error: null,
        };

        console.log("Updated card data:", updatedCardData);
        setCardData(updatedCardData);
      } catch (error) {
        console.error("Error setting card data:", error);
        setCardData(prevState => ({ ...prevState, error: error as Error, loading: false }));
      }
    };

    fetchCardData();
  }, [id]);

  const handleButtonClick = (content: string) => {
    setCardData(prevState => ({ ...prevState, original: content }));
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

  const { link, loading, error, genertedtitle } = cardData;

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      <main className="flex-1 flex flex-col">
        <SubHeader
          onAudioSubmit={() => { }}
          audioLink={link}
          onProcessClick={() => { }}
          onFetchResult={() => { }}
          onLinkChange={() => { }}
          link={link}
          resultCache={{
            Original: cardData.original,
            Translate: cardData.translation,
            KeyWords: cardData.keywords,
            KeyGrammer: cardData.keygrammer,
            RewriteArticle: cardData.rewritedarticle,
            Questions: cardData.questions,
            ExportNotes: cardData.notes,
          }}
          detectedLanguage={cardData.lang}
          wordCount={cardData.wordcount}
          generatedTitle={genertedtitle}
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
            resultCache={{
              Original: cardData.original,
              Translate: cardData.translation,
              KeyWords: cardData.keywords,
              KeyGrammer: cardData.keygrammer,
              RewriteArticle: cardData.rewritedarticle,
              Questions: cardData.questions,
              ExportNotes: cardData.notes,
            }}
          />
          <MainContent
            resultCache={{
              Original: cardData.original,
              Translate: cardData.translation,
              KeyWords: cardData.keywords,
              KeyGrammer: cardData.keygrammer,
              RewriteArticle: cardData.rewritedarticle,
              Questions: cardData.questions,
              ExportNotes: cardData.notes,
            }}
            indexStr={indexStr}
          />
        </div>
      </main>
    </div>
  );
};

export default ViewCard;