import React, { useState, useEffect, useContext } from 'react';
import SubHeader from '@/components/studyroom/SubHeaderForView';
import Navigation from '@/components/studyroom/Navigation';
import MainContent from '@/components/studyroom/MainContent';
import AccessBlock from '@/components/dashboard/AccessBlock';
import { getDb } from '@/models/db';
import { AppContext } from '@/contexts/AppContext';
import { useActiveComponent } from '@/contexts/ActiveComponentContext';
import { v4 as uuidv4 } from 'uuid';
import { getUserQuota, decrementRunAIQuota } from "@/services/order";
import { getLangFromEpisodeID } from "@/models/episode"
import LongCard from './LongCard';

interface ViewCardProps {
  episodeId: string; // 新增 episodeId 属性
}

interface CardData {
  id: string;
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
  sentence: string;
  loading: boolean;
  error: Error | null;
}

interface EpisodeData {
  id: string;
  title: string;
  description: string;
  published_at: string;
  imageUrl: string;
  audioUrl: string;
  card_id: string; // 新增 card_id 属性
  card_id_fr: string;
  card_id_cn: string;
  card_id_jp: string;
}

const ViewCard: React.FC<ViewCardProps> = ({ episodeId }) => {
  const [cardData, setCardData] = useState<{ [key: string]: CardData }>({
    card_id: {
      id: '',
      userid: 0,
      uuid: '',
      link: '',
      likes: 0,
      create_at: '',
      original: '',
      sentence: '',
      translation: '',
      keywords: '',
      keygrammer: '',
      rewritedarticle: '',
      questions: '',
      notes: '',
      loading: true,
      error: null,
    },
    card_id_fr: {
      id: '',
      userid: 0,
      uuid: '',
      link: '',
      likes: 0,
      create_at: '',
      original: '',
      sentence: '',
      translation: '',
      keywords: '',
      keygrammer: '',
      rewritedarticle: '',
      questions: '',
      notes: '',
      loading: true,
      error: null,
    },
    card_id_cn: {
      id: '',
      userid: 0,
      uuid: '',
      link: '',
      likes: 0,
      create_at: '',
      original: '',
      sentence: '',
      translation: '',
      keywords: '',
      keygrammer: '',
      rewritedarticle: '',
      questions: '',
      notes: '',
      loading: true,
      error: null,
    },
    card_id_jp: {
      id: '',
      userid: 0,
      uuid: '',
      link: '',
      likes: 0,
      create_at: '',
      original: '',
      sentence: '',
      translation: '',
      keywords: '',
      keygrammer: '',
      rewritedarticle: '',
      questions: '',
      notes: '',
      loading: true,
      error: null,
    },
  });

  const [episodeData, setEpisodeData] = useState<EpisodeData>({
    id: '',
    title: '',
    description: '',
    published_at: '',
    imageUrl: '',
    audioUrl: '',
    card_id: '',
    card_id_fr: '',
    card_id_cn: '',
    card_id_jp: '',
  });

  const [indexStr, setIndexStr] = useState<keyof MainContentProps['resultCache']>('Original');
  const [isFavorited, setIsFavorited] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const { lang, user } = useContext(AppContext);
  const { setActiveComponent } = useActiveComponent();

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const supabase = await getDb();
        const { data, error } = await supabase
          .from('episodes')
          .select('*')
          .eq('id', episodeId)
          .single();

        if (error) {
          throw error;
        }

        const updatedEpisodeData: EpisodeData = {
          id: data.id,
          title: data.title,
          description: data.description,
          published_at: data.published_at,
          imageUrl: data.imgurl,
          audioUrl: data.audiourl,
          card_id: data.card_id,
          card_id_fr: data.card_id_fr,
          card_id_cn: data.card_id_cn,
          card_id_jp: data.card_id_jp,
        };

        setEpisodeData(updatedEpisodeData);
      } catch (error) {
        console.error("Error fetching episode data:", error);
      }
    };

    fetchEpisodeData();
  }, [episodeId]);
  useEffect(() => {
    const fetchCardData = async (cardId: string, key: string) => {
      try {
        console.log("vc fetch card data:" + cardId);
        const supabase = await getDb();
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', cardId)
          .single();

        if (error) {
          throw error;
        }
        console.log("vc fetch card data:" + data.id);
        const updatedCardData: CardData = {
          id: data.id,
          userid: data.userid,
          uuid: data.uuid,
          link: data.link,
          likes: data.likes,
          create_at: data.create_at,
          original: data.original || '',
          sentence: data.sentence || '',
          translation: data.translation || '',
          keywords: data.keywords || '',
          keygrammer: data.keygrammer || '',
          rewritedarticle: data.rewritedarticle || '',
          questions: data.questions || '',
          notes: data.notes || '',
          loading: false,
          error: null,
        };

        setCardData(prevState => ({ ...prevState, [key]: updatedCardData }));
      } catch (error) {
        setCardData(prevState => ({ ...prevState, [key]: { ...prevState[key], error: error as Error, loading: false } }));
      }
    };

    if (episodeData.card_id) fetchCardData(episodeData.card_id, 'card_id');
    if (episodeData.card_id_fr) fetchCardData(episodeData.card_id_fr, 'card_id_fr');
    if (episodeData.card_id_cn) fetchCardData(episodeData.card_id_cn, 'card_id_cn');
    if (episodeData.card_id_jp) fetchCardData(episodeData.card_id_jp, 'card_id_jp');

    console.log("vc:" + episodeData.card_id);
    console.log("vc:" + episodeData.card_id_fr);
    console.log("vc:" + episodeData.card_id_cn);
    console.log("vc:" + episodeData.card_id_jp);

  }, [episodeData.card_id, episodeData.card_id_fr, episodeData.card_id_cn, episodeData.card_id_jp]);

  // 在 useEffect 外部添加日志，确保 cardData 更新后访问
  useEffect(() => {
    console.log("vc another useeffect:" + cardData.card_id.id);
    console.log("vc another useeffect:" + cardData.card_id_fr.id);
    console.log("vc another useeffect:" + cardData.card_id_cn.id);
    console.log("vc another useeffect:" + cardData.card_id_jp.id);
  }, [cardData]);

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (!user || !episodeId) return;

      const supabase = await getDb();

      try {
        const { data: favoriteData, error: favoriteError } = await supabase
          .from('user_episodes_collection')
          .select('*')
          .eq('user_id', user.user_id)
          .eq('episode_id', episodeId)
          .maybeSingle();

        if (favoriteError && favoriteError.code !== 'PGRST116') {
          console.error("Error checking favorite:", favoriteError.message);
          return;
        }

        setIsFavorited(!!favoriteData);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkIfFavorited();
  }, [user, episodeId]);

  useEffect(() => {
    const checkUserPermission = async () => {
      console.log("episode status:" + episodeData.card_id);
      if (!user || !episodeId) return;

      const supabase = await getDb();

      try {
        const { data: permissionData, error: permissionError } = await supabase
          .from('user_episodes_permissions')
          .select('permission')
          .eq('user_id', user.user_id)
          .eq('episode_id', episodeId)
          .maybeSingle();

        if (permissionError && permissionError.code !== 'PGRST116') {
          console.error("Error checking permission:", permissionError.message);
          return;
        }

        setHasPermission(permissionData?.permission || false);
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    };

    checkUserPermission();
  }, [user, episodeId]);

  const handleFlagClick = (flag: string) => {
    setSelectedFlag(flag);
    console.log(`Flag clicked: ${flag}`);
    // 在这里处理点击事件，例如切换语言或执行其他操作
  };

  const handleFavoriteClick = async (episodeId: string) => {
    if (!user || !episodeId) return;

    const supabase = await getDb();
    console.log("vc:user_id:" + user.user_id);
    try {
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('user_episodes_collection')
        .select('*')
        .eq('user_id', user.user_id)
        .eq('episode_id', episodeId)
        .maybeSingle();

      if (favoriteError && favoriteError.code !== 'PGRST116') {
        console.error("Error checking favorite:", favoriteError.message);
        return;
      }

      if (favoriteData) {
        // 取消收藏
        const { error: deleteError } = await supabase
          .from('user_episodes_collection')
          .delete()
          .eq('user_id', user.user_id)
          .eq('episode_id', episodeId);

        if (deleteError) {
          console.error("Error deleting favorite:", deleteError.message);
        } else {
          setIsFavorited(false);
          console.log("Episode removed from favorites");
        }
      } else {
        // 添加收藏
        const { error: insertError } = await supabase
          .from('user_episodes_collection')
          .insert([{ user_id: user.user_id, episode_id: episodeId }]);

        if (insertError) {
          console.error("Error inserting favorite:", insertError.message);
        } else {
          setIsFavorited(true);
          console.log("Episode added to favorites");
        }
      }
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  const handleButtonClick = (content: string) => {
    setCardData(prevState => ({ ...prevState, original: content }));
  };

  const handleShowOriginalClick = () => {
    setIndexStr('Original');
  };
  const handleSentenceClick = () => {
    setIndexStr('Sentence');
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
  const handleDictationClick = () => {
    setIndexStr('Dictation');
  };

  const handleSubscribeClick = () => {
    setActiveComponent('plan');
  };

  const handleRunAI = async (episodeId: string) => {
    console.log("run ai click");
    if (!user || !episodeId) return;

    // 获取用户的配额信息
    const userQuota = await getUserQuota(user.email);

    if (!userQuota) {
      console.error("User not found or quota information missing.");
      return;
    }

    // 检查 run_ai_quota 是否大于等于1
    if (userQuota.run_ai_quota < 1) {
      console.error("Run AI quota is insufficient.");
      return;
    }

    // 扣减 run_ai_quota
    const decrementResult = await decrementRunAIQuota(user.email);
    if (!decrementResult.success) {
      console.error(decrementResult.message);
      return; // 如果扣减失败，直接返回，不插入任务
    }

    const episode_lang = await getLangFromEpisodeID(episodeId);
    if (episode_lang) {
      console.log("Language for the episode:", episode_lang);
    } else {
      console.error("Failed to retrieve language information.");
    }

    const taskId = uuidv4();
    const cardId = uuidv4();
    const startTime = new Date().toISOString();

    const taskData = {
      id: taskId,
      user_id: user.user_id,
      link: episodeData.audioUrl,
      title: "",
      start_time: startTime,
      status: 'pending',
      lang: episode_lang,
      card_id: cardId,
      episode_id: episodeId,
      user_lang: lang
    };
    console.log(taskData);

    try {
      const supabase = await getDb();
      const { error: taskError } = await supabase.from('task').insert([taskData]);
      if (taskError) {
        console.error("Error inserting task: ", taskError);
        // 你可能需要在这里处理插入任务失败的情况，例如回滚配额扣减操作
        return;
      }
    } catch (error) {
      console.error("Error inserting task: ", error);
    }
  };

  const { title, description, published_at, imageUrl, audioUrl } = episodeData;

  const selectedCardData = selectedFlag ? cardData[selectedFlag] : cardData['card_id'];

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4 w-7/8 h-5/6 flex flex-col overflow-hidden mt-0 mx-auto">
        <div className="flex-none">
          <SubHeader
            episodeData={{
              id: episodeData.id,
              title,
              description,
              published_at,
              imageUrl,
              audioUrl,
              card_id: episodeData.card_id,
              card_id_fr: episodeData.card_id_fr,
              card_id_cn: episodeData.card_id_cn,
              card_id_jp: episodeData.card_id_jp,
            }}
            isFavorited={isFavorited}
            onFavoriteClick={handleFavoriteClick}
            onRunAIClick={handleRunAI}
          />
        </div>

        {/* LongBar Component */}
        <div className="flex-none w-full">
          <LongCard
            labels={['Label 1', 'Label 2', 'Label 3', 'Label 4']}
            card_id={episodeData.card_id}
            card_id_fr={episodeData.card_id_fr}
            card_id_cn={episodeData.card_id_cn}
            card_id_jp={episodeData.card_id_jp}
            onFlagClick={handleFlagClick}
            episode_id={episodeData.id}
            onRunAIClick={handleRunAI}
          />
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-none w-1/9">
            <Navigation
              onButtonClick={handleButtonClick}
              onShowOriginalClick={handleShowOriginalClick}
              onTranslateClick={handleTranslateClick}
              onKeyWordsClick={handleKeyWordsClick}
              onKeyGrammerClick={handleKeyGrammerClick}
              onRewriteArticleClick={handleRewriteArticleClick}
              onQuestionsClick={handleQuestionsClick}
              onExportNotesClick={handleExportNotesClick}
              onDictationClick={handleDictationClick}
              onSentenceClick={handleSentenceClick}
              resultCache={{
                Original: selectedCardData ? selectedCardData.original : '',
                Sentence: selectedCardData ? selectedCardData.sentence : '',
                Translate: selectedCardData ? selectedCardData.translation : '',
                KeyWords: selectedCardData ? selectedCardData.keywords : '',
                KeyGrammer: selectedCardData ? selectedCardData.keygrammer : '',
                RewriteArticle: selectedCardData ? selectedCardData.rewritedarticle : '',
                Questions: selectedCardData ? selectedCardData.questions : '',
                ExportNotes: selectedCardData ? selectedCardData.notes : '',
              }}
              className="h-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {(hasPermission) ? (
              <MainContent
                resultCache={{
                  Original: selectedCardData ? selectedCardData.original : '',
                  Sentence: selectedCardData ? selectedCardData.sentence : '',
                  Translate: selectedCardData ? selectedCardData.translation : '',
                  KeyWords: selectedCardData ? selectedCardData.keywords : '',
                  KeyGrammer: selectedCardData ? selectedCardData.keygrammer : '',
                  RewriteArticle: selectedCardData ? selectedCardData.rewritedarticle : '',
                  Questions: selectedCardData ? selectedCardData.questions : '',
                  ExportNotes: selectedCardData ? selectedCardData.notes : '',
                }}
                audioUrl
                indexStr={indexStr}
                className="p-4"
              />
            ) : (
              <AccessBlock
                onSubscribeClick={handleSubscribeClick}
                handleRunAI={() => handleRunAI(user, episodeId)}
                user={user}
                episodeId={episodeId}
                card_id={episodeData.card_id}
                card_id_fr={episodeData.card_id_fr}
                card_id_cn={episodeData.card_id_cn}
                card_id_jp={episodeData.card_id_jp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCard;