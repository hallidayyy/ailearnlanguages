import React, { useState, useEffect, useContext } from 'react';
import PodcastTable from './PodcastTable';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { useActiveComponent } from '@/contexts/ActiveComponentContext';
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确

interface Podcast {
  id: number;
  name: string;
  url: string;
  author: string;
  desc: string;
  imageUrl: string;
}

interface UserPodcastCollection {
  podcasts: {
    id: number;
    title: string;
    url: string;
    author: string;
    description: string;
    imageurl: string;
  };
}

const Podcasts: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setActiveComponent, setSelectedPodcastId } = useActiveComponent();
  const { lang, user } = useContext(AppContext); // 从 AppContext 中获取 user 信息

  const handlePodcastSelect = (id: number) => {
    setSelectedPodcastId(id);
    setActiveComponent('podcastdetail');
  };

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        console.log("user id:" + user?.user_id);
        const supabase = await getDb();
        const { data: podcastsData, error: podcastsError } = await supabase
          .from('user_podcasts_collection')
          .select('podcasts(*)')
          .eq('user_id', user.user_id);

        if (podcastsError) {
          setError(podcastsError.message);
        } else {
          const mappedPodcasts = (podcastsData as unknown as UserPodcastCollection[]).map(item => ({
            id: item.podcasts.id,
            name: item.podcasts.title,
            url: item.podcasts.url,
            author: item.podcasts.author,
            desc: item.podcasts.description,
            imageUrl: item.podcasts.imageurl
          }));
          setPodcasts(mappedPodcasts || []);
        }
      } catch (error) {
        console.error('Failed to fetch podcasts data:', error);
        setError('Failed to fetch podcasts data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [user?.user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-1 flex justify-center">
      <div className="w-full">
        <PodcastTable podcasts={podcasts} onPodcastSelect={handlePodcastSelect} />
      </div>
    </div>
  );
};

export default Podcasts;