import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ActiveComponentContextProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  selectedPodcastId: number | null;
  setSelectedPodcastId: (id: number | null) => void;
  selectedEpisodeId: number | null;
  setSelectedEpisodeId: (id: number | null) => void;
}

const ActiveComponentContext = createContext<ActiveComponentContextProps>({
  activeComponent: 'explore',
  setActiveComponent: () => {},
  selectedPodcastId: null,
  setSelectedPodcastId: () => {},
  selectedEpisodeId: null,
  setSelectedEpisodeId: () => {},
});

export const useActiveComponent = () => useContext(ActiveComponentContext);

interface ActiveComponentProviderProps {
  children: ReactNode;
}

export const ActiveComponentProvider: React.FC<ActiveComponentProviderProps> = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState('explore');
  const [selectedPodcastId, setSelectedPodcastId] = useState<number | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);

  return (
    <ActiveComponentContext.Provider value={{ 
      activeComponent, 
      setActiveComponent, 
      selectedPodcastId, 
      setSelectedPodcastId, 
      selectedEpisodeId, 
      setSelectedEpisodeId 
    }}>
      {children}
    </ActiveComponentContext.Provider>
  );
};