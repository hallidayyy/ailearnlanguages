import React from 'react';
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';
import ComponentC from './ComponentC';
import SettingPage from './SettingPage';
import PlanPage from './PlanPage';
import PodcastDetails from './PodcastDetails';
import ViewCard from '@/components/studyroom/ViewCard'; // 确保路径正确
import { useActiveComponent } from '@/contexts/ActiveComponentContext';

const DashboardContent: React.FC = () => {
  const { activeComponent, selectedPodcastId, selectedEpisodeId } = useActiveComponent();

  const componentsMap: { [key: string]: React.ReactNode } = {
    explore: <ComponentA />,
    episodes: <ComponentB />,
    podcasts: <ComponentC />,
    plan: <PlanPage />,
    reports: <ComponentC />,
    settings: <SettingPage />,
    podcastdetail: <PodcastDetails podcastId={selectedPodcastId} />,
    viewcard: <ViewCard episodeId={selectedEpisodeId} />, // 添加 viewcard 组件
    
  };

  return componentsMap[activeComponent] || <ComponentA />;
};

export default DashboardContent;