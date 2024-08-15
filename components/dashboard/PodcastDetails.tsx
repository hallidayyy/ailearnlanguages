import React, { useState, useEffect, useContext } from 'react';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import EpisodeTable from './EpisodeTable'; // 确保路径正确
import PodcastCardvertical from './PodcastCardVertical'; // 确保路径正确
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确

interface PodcastDetailProps {
  podcastId: number | null;
}

interface Episode {
  id: string;
  title: string;
  podcast_id: string;
  published_at: string;
  status: string;
  imgurl: string;
  audiourl: string;
  description: string;
  card_id: string;
  card_id_fr: string;
  card_id_cn: string;
  card_id_jp: string;

}

const PodcastDetail: React.FC<PodcastDetailProps> = ({ podcastId }) => {
  const [podcast, setPodcast] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { lang, user } = useContext(AppContext); // 从 AppContext 中获取 user 信息

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      if (!podcastId) return;

      try {
        const supabase = await getDb();
        const { data: podcastData, error: podcastError } = await supabase
          .from('podcasts')
          .select('*')
          .eq('id', podcastId)
          .single();

        if (podcastError) {
          setError(podcastError.message);
        } else {
          setPodcast(podcastData);
        }

        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('podcast_id', podcastId);

        if (episodesError) {
          setError(episodesError.message);
        } else {
          setEpisodes(episodesData || []);
        }

        console.log("user id:" + user?.user_id);
        console.log("lang:" + lang);
        // 检查用户是否收藏了该 podcast
        if (user) {
          const { data: favoriteData, error: favoriteError } = await supabase
            .from('user_podcasts_collection')
            .select('*')
            .eq('user_id', user.user_id)
            .eq('podcast_id', podcastId)
            .maybeSingle();

          if (favoriteError) {
            setError(favoriteError.message);
          } else {
            setIsFavorited(!!favoriteData);
          }

        }
      } catch (error) {
        console.error('Failed to fetch podcast details:', error);
        setError('Failed to fetch podcast details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastDetails();
  }, [podcastId, user]);

  const handleFavoriteClick = async () => {
    if (!user || !podcastId) return;

    const supabase = await getDb();

    if (isFavorited) {
      // 取消收藏

      console.log("delete favoureite");
      const { error: deleteError } = await supabase
        .from('user_podcasts_collection')
        .delete()
        .eq('user_id', user.user_id)
        .eq('podcast_id', podcastId);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        setIsFavorited(false);
      }
    } else {
      // 添加收藏
      const { error: insertError } = await supabase
        .from('user_podcasts_collection')
        .insert([{ user_id: user.user_id, podcast_id: podcastId }]);

      if (insertError) {
        setError(insertError.message);
      } else {
        setIsFavorited(true);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!podcast) {
    return <div>No podcast found.</div>;
  }

  return (
    <div>
      <PodcastCardvertical
        title={podcast.title}
        desc={podcast.description}
        imgurl={podcast.imageurl}
        isFavorited={isFavorited}
        onFavoriteClick={handleFavoriteClick}
      />

      <EpisodeTable episodes={episodes} />
    </div>
  );
};

export default PodcastDetail;