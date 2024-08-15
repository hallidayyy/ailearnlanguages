import React from 'react';
import Explore from './Explore';
import Episodes from './Episodes';
import Report from './Report';
import SettingPage from './SettingPage';
import PlanPage from './PlanPage';
import PodcastDetails from './PodcastDetails';
import ViewCard from '@/components/studyroom/ViewCard'; // 确保路径正确
import { useActiveComponent } from '@/contexts/ActiveComponentContext';
import Podcasts from './Podcasts';

const DashboardContent: React.FC = () => {
  const { activeComponent, selectedPodcastId, selectedEpisodeId } = useActiveComponent();

  const componentsMap: { [key: string]: React.ReactNode } = {
    explore: <Explore />,
    episodes: <Episodes />,
    podcasts: <Podcasts />,
    plan: <PlanPage />,
    reports: <Report />,
    settings: <SettingPage />,
    podcastdetail: <PodcastDetails podcastId={selectedPodcastId} />,
    viewcard: <ViewCard episodeId={selectedEpisodeId !== null ? String(selectedEpisodeId) : ''} />, // 将 selectedEpisodeId 转换为字符串类型
  };

  return componentsMap[activeComponent] || <Explore />;
};

export default DashboardContent;