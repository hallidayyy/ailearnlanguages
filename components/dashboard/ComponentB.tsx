import React, { useState, useEffect, useContext } from 'react';
import EpisodeTable from './EpisodeTable';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确
import EpisodeTypeChooser from '@/components/dashboard/EpisodeTypeChooser';

interface Episode {
  // 根据你的实际数据结构定义 Episode 类型
  id: number;
  title: string;
  // 其他字段...
}

const ComponentB: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('collected');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { lang, user } = useContext(AppContext); // 从 AppContext 中获取 user 信息

  useEffect(() => {
    if (!user) {
      console.error('User is undefined');
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      const supabase = await getDb();
      setLoading(true); // 开始加载
      setError(null); // 重置错误状态

      let data: any[] = [];
      let error: any = null;

      try {
        switch (selectedOption) {
          case 'collected':
            // 调用存储过程获取收藏的 episodes
            ({ data, error } = await supabase
              .from('user_episodes_collection')
              .select('episodes(*)')
              .eq('user_id', user.user_id));
            // console.log("collected: ", data);
            const episodesData = data.map((item: any) => item.episodes);
            // console.log("ed: ", episodesData);
            setEpisodes(episodesData);
            break;

          case 'access':
            ({ data, error } = await supabase
              .from('user_episodes_permissions')
              .select('episodes(*)')
              .eq('user_id', user.user_id));
            // console.log("access: ", data);
            const episodesData1 = data.map((item: any) => item.episodes);
            // console.log("ed: ", episodesData1);
            setEpisodes(episodesData1);
            break;

          case 'run':
            // 第一步：从 `task` 表中获取 `episode_id` 列表，排除 null 值
            const { data: episodeIdsData, error: episodeIdsError } = await supabase
              .from('task')
              .select('episode_id')
              .eq('user_id', user.user_id)
              .not('episode_id', 'is', null); // 排除 null 值

            if (episodeIdsError) {
              console.error('Error fetching episode IDs:', episodeIdsError);
              return;
            }

            // console.log("step1: ", episodeIdsData);
            // 去重
            const uniqueEpisodeIds = Array.from(new Set(episodeIdsData.map(item => item.episode_id)));

            if (uniqueEpisodeIds.length === 0) {
              // console.log('No episode IDs found for the user.');
              return;
            }

            // 第二步：根据 `episode_id` 列表从 `episodes` 表中获取详细数据
            ({ data, error } = await supabase
              .from('episodes')
              .select('*')
              .in('id', uniqueEpisodeIds));

            setEpisodes(data);

            // console.log('Fetched episodes in run:', data);
            break;

          default:
            console.error('Unknown option:', selectedOption);
            return;
        }

        // console.log('Fetched episodes:', data);

      } catch (error) {
        console.error('Error fetching episodes:', error);
        setError('Failed to load episodes. Please try again later.');
      } finally {
        setLoading(false); // 无论成功还是失败都要结束加载
      }
    };

    fetchEpisodes();
  }, [selectedOption, user?.user_id]);
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

export default ComponentB;