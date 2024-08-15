import React, { useState, useEffect, useContext } from 'react';
import EpisodeTable from './EpisodeTable';
import { getDb } from '@/models/db'; 
import { AppContext } from '@/contexts/AppContext'; 
import EpisodeTypeChooser from '@/components/dashboard/EpisodeTypeChooser';

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
interface Task {
  episode_id: number;
}

const Episodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('collected');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { lang, user } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      console.error('User is undefined');
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      const supabase = await getDb();
      setLoading(true);
      setError(null);

      try {
        let data: any[] = [];

        switch (selectedOption) {
          case 'collected':
            data = await fetchCollectedEpisodes(supabase, user.user_id);
            break;
          case 'access':
            data = await fetchAccessEpisodes(supabase, user.user_id);
            break;
          case 'run':
            data = await fetchRunEpisodes(supabase, user.user_id);
            break;
          default:
            console.error('Unknown option:', selectedOption);
            return;
        }

        setEpisodes(data);
      } catch (error) {
        console.error('Error fetching episodes:', error);
        setError('Failed to load episodes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [selectedOption, user?.user_id]);

  const fetchCollectedEpisodes = async (supabase: any, userId: number) => {
    const { data, error } = await supabase
      .from('user_episodes_collection')
      .select('episodes(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map((item: { episodes: Episode }) => item.episodes);
  };

  const fetchAccessEpisodes = async (supabase: any, userId: number) => {
    const { data, error } = await supabase
      .from('user_episodes_permissions')
      .select('episodes(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map((item: { episodes: Episode }) => item.episodes);
  };

  const fetchRunEpisodes = async (supabase: any, userId: number) => {
    const { data: episodeIdsData, error: episodeIdsError } = await supabase
      .from('task')
      .select('episode_id')
      .eq('user_id', userId)
      .not('episode_id', 'is', null);

    if (episodeIdsError) throw episodeIdsError;

    const uniqueEpisodeIds = Array.from(new Set(episodeIdsData.map((item: Task) => item.episode_id)));

    if (uniqueEpisodeIds.length === 0) return [];

    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .in('id', uniqueEpisodeIds);

    if (error) throw error;
    return data;
  };

  if (loading) {
    return <div>Loading episodes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-1 flex justify-center">
      <div className="w-full">
        <EpisodeTypeChooser onOptionChange={setSelectedOption} />
        <EpisodeTable episodes={episodes} />
      </div>
    </div>
  );
};

export default Episodes;