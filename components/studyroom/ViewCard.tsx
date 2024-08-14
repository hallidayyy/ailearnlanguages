import React, { useState, useEffect, useContext } from 'react';
import SubHeader from '@/components/studyroom/SubHeaderForView';
import Navigation from '@/components/studyroom/Navigation';
import MainContent from '@/components/studyroom/MainContent';
import AccessBlock from '@/components/dashboard/AccessBlock'; // 假设你有一个 AccessBlock 组件
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确
import { useActiveComponent } from '@/contexts/ActiveComponentContext'; // 确保路径正确
import { v4 as uuidv4 } from 'uuid';
import { getUserQuota, decrementRunAIQuota } from "@/services/order";
import { getLangFromEpisodeID } from "@/models/episode"

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

}

const ViewCard: React.FC<ViewCardProps> = ({ episodeId }) => {
  const [cardData, setCardData] = useState<CardData>({
    id: '',
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

    loading: true,
    error: null,
  });

  const [episodeData, setEpisodeData] = useState<EpisodeData>({
    id: '',
    title: '',
    description: '',
    published_at: '',
    imageUrl: '',
    audioUrl: '',
    card_id: '',

  });

  const [indexStr, setIndexStr] = useState<keyof MainContentProps['resultCache']>('Original');
  const [isFavorited, setIsFavorited] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useContext(AppContext); // 从 AppContext 中获取 user 信息
  const { setActiveComponent } = useActiveComponent(); // 从 ActiveComponentContext 中获取 setActiveComponent 函数

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        console.log("ep id in vc" + episodeId);
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
          status: data.status
        };

        setEpisodeData(updatedEpisodeData);
      } catch (error) {
        console.error("Error fetching episode data:", error);
      }
    };

    fetchEpisodeData();
  }, [episodeId]);

  useEffect(() => {
    const fetchCardData = async () => {
      if (!episodeData.card_id) return;

      try {
        console.log("ep id:" + episodeData.id);
        console.log("card id:" + episodeData.card_id);
        const supabase = await getDb();
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('id', episodeData.card_id)
          .single();

        if (error) {
          throw error;
        }

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
          loading: false,
          error: null,
        };

        setCardData(updatedCardData);
      } catch (error) {
        setCardData(prevState => ({ ...prevState, error: error as Error, loading: false }));
      }
    };

    fetchCardData();
  }, [episodeData.card_id]);

  useEffect(() => {
    const checkIfFavorited = async () => {
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
      console.log("vc:user_id:" + user.user_id);
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
        // setHasPermission(true);
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    };

    checkUserPermission();
  }, [user, episodeId]);

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

    const lang = await getLangFromEpisodeID(episodeId);
    if (lang) {
      console.log("Language for the episode:", lang);
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
      lang: lang, // 假设语言为英语，根据实际情况调整
      card_id: cardId,
      episode_id: episodeId
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

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4 w-4/5 h-4/5 flex flex-col overflow-hidden mt-4 mx-auto">
        <div className="flex-none">
          <SubHeader
            episodeData={{
              id: episodeData.id,
              title,
              description,
              published_at,
              imageUrl,
              audioUrl,
              card_id: episodeData.card_id, // 传递 card_id 属性
            }}
            isFavorited={isFavorited}
            onFavoriteClick={handleFavoriteClick}
            onRunAIClick={handleRunAI} // 传递 onRunAIClick 回调函数
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
              resultCache={{
                Original: cardData.original,
                Translate: cardData.translation,
                KeyWords: cardData.keywords,
                KeyGrammer: cardData.keygrammer,
                RewriteArticle: cardData.rewritedarticle,
                Questions: cardData.questions,
                ExportNotes: cardData.notes,
              }}
              className="h-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {(hasPermission) ? (
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
                className="p-4"
              />
            ) : (
              <AccessBlock
                onSubscribeClick={handleSubscribeClick}
                handleRunAI={() => handleRunAI(user, episodeId)}
                user={user}
                episodeId={episodeId}
                card_id = {episodeData.card_id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCard;