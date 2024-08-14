import React, { useState, useEffect, useContext } from 'react';
import EpisodeTable from './EpisodeTable';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确

const ComponentB: React.FC = () => {
  const [episodes, setEpisodes] = useState([]);
  const { lang, user } = useContext(AppContext); // 从 AppContext 中获取 user 信息

  useEffect(() => {
    const fetchEpisodes = async () => {
      const supabase = await getDb();

      console.log("user id:" + user?.user_id);



      const { data, error } = await supabase
        .from('user_episodes_collection')
        .select('episodes(*)')
        .eq('user_id', user.user_id);

      if (error) {
        console.error('Error fetching episodes:', error);
        return;
      }

      const episodesData = data.map(item => item.episodes);
      setEpisodes(episodesData);
    };

    fetchEpisodes();
  }, []);

  return (
    <div className="p-1 flex justify-center">
      <div className="w-full">
        {/* <SearchAndFilterBar /> */}
        <EpisodeTable episodes={episodes} />
      </div>
    </div>
  );
};

export default ComponentB;