import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getDb } from './db';

interface UserReport {
  podcastCollectionCount: number;
  episodeCollectionCount: number;
  registrationDate: string;
  podcastListenCount: number;
  aiRunCount: number;
}

export async function getReport(user_id: string): Promise<UserReport> {
  const supabase = await getDb();

  try {
    // 查询 users 表格的 created_at
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('created_at')
      .eq('id', user_id)
      .single();

    if (userError) {
      throw userError;
    }

    // 查询 task 表格的记录 count
    const { count: taskCount, error: taskError } = await supabase
      .from('task')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    if (taskError) {
      throw taskError;
    }

    // 查询 user_podcasts_collection 的 count
    const { count: userPodcastsCollectionCount, error: userPodcastsCollectionError } = await supabase
      .from('user_podcasts_collection')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    if (userPodcastsCollectionError) {
      throw userPodcastsCollectionError;
    }

    // 查询 user_episodes_collection 的 count
    const { count: userEpisodesCollectionCount, error: userEpisodesCollectionError } = await supabase
      .from('user_episodes_collection')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    if (userEpisodesCollectionError) {
      throw userEpisodesCollectionError;
    }

    // 查询 user_episodes_permission 的 count
    const { count: userEpisodesPermissionCount, error: userEpisodesPermissionError } = await supabase
      .from('user_episodes_permissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id);

    if (userEpisodesPermissionError) {
      throw userEpisodesPermissionError;
    }

    return {
      registrationDate: new Date(userData.created_at).toLocaleDateString(),
      aiRunCount: taskCount ?? 0,
      podcastCollectionCount: userPodcastsCollectionCount ?? 0,
      episodeCollectionCount: userEpisodesCollectionCount ?? 0,
      podcastListenCount: userEpisodesPermissionCount ?? 0,
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}