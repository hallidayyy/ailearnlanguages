// @/models/episode.ts

import { getDb } from '@/models/db'; // 确保路径正确

const getLangFromEpisodeID = async (episodeId: string): Promise<string | null> => {
  try {
    const supabase = await getDb();
    
    // 首先通过 episodeId 获取对应的 podcast_id
    const { data: episodeData, error: episodeError } = await supabase
      .from('episodes')
      .select('podcast_id')
      .eq('id', episodeId)
      .single();

    if (episodeError) {
      console.error("Error fetching episode data:", episodeError);
      return null;
    }

    const podcastId = episodeData.podcast_id;

    if (!podcastId) {
      console.error("Podcast ID not found for the given episode.");
      return null;
    }

    // 根据 podcast_id 查询 podcasts 表格的 lang 字段
    const { data: podcastData, error: podcastError } = await supabase
      .from('podcasts')
      .select('lang')
      .eq('id', podcastId)
      .single();

    if (podcastError) {
      console.error("Error fetching podcast data:", podcastError);
      return null;
    }

    return podcastData.lang || null;
  } catch (error) {
    console.error("Error in getLangFromEpisodeID:", error);
    return null;
  }
};

// 导出函数
export { getLangFromEpisodeID };