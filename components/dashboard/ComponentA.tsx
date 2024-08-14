import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPodcast } from '@fortawesome/free-solid-svg-icons';
import EpisodeCard from './EpisodeCard';
import PodcastCard from './PodcastCard';
import Label from './Label';
import ContentLangChooser from './ContentLangChooser';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { useLanguage } from '@/contexts/LearnLanguageContext';
import { useActiveComponent } from '@/contexts/ActiveComponentContext';

const ComponentA: React.FC = () => {
    const [data, setData] = useState<{ mediaCards: any[]; podcastCards: any[] }>({ mediaCards: [], podcastCards: [] });
    const { selectedLang } = useLanguage();
    const { setActiveComponent, setSelectedPodcastId, setSelectedEpisodeId } = useActiveComponent();

    useEffect(() => {
        const fetchData = async () => {
            const supabase = await getDb();

            // 获取随机的 12 个 episodes
            const { data: mediaCards, error: mediaError } = await supabase
                .rpc('random_episodes', { lang_code: selectedLang.code });

            if (mediaError) {
                console.error('Error fetching mediaCards:', mediaError);
                return;
            }

            // 获取随机的 10 个 podcasts
            const { data: podcastCards, error: podcastError } = await supabase
                .rpc('random_podcasts', { lang_code: selectedLang.code });

            if (podcastError) {
                console.error('Error fetching podcastCards:', podcastError);
                return;
            }

            setData({ mediaCards, podcastCards });
        };

        fetchData();
    }, [selectedLang]);

    const handleEpisodeClick = (episodeId: number) => {
        setSelectedEpisodeId(episodeId);
        setActiveComponent('viewcard');
    };

    const handlePodcastClick = (podcastId: number) => {
        setSelectedPodcastId(podcastId);
        setActiveComponent('podcastdetail');
    };

    return (
        <div className="p-4">
            <ContentLangChooser />
            <Label
                text="episodes"
                linkUrl=""
                Icon={() => <FontAwesomeIcon icon={faPodcast} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                {data.mediaCards.map((card, index) => (
                    <EpisodeCard
                        key={index}
                        title={card.title}
                        author={card.author}
                        imageUrl={card.imgurl}
                        id={card.id}
                        onClick={() => handleEpisodeClick(card.id)}
                    />
                ))}
            </div>

            <Label
                text="podcasts"
                linkUrl=""
                Icon={() => <FontAwesomeIcon icon={faPodcast} />}
            />

            <div className="flex overflow-x-auto gap-8">
                {data.podcastCards.map((card, index) => (
                    <PodcastCard
                        key={index}
                        imageUrl={card.imageurl}
                        title={card.title}
                        id={card.id}
                        onClick={() => handlePodcastClick(card.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ComponentA;