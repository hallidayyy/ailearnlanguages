import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPodcast } from '@fortawesome/free-solid-svg-icons';
import EpisodeCard from './EpisodeCard';
import PodcastCard from './PodcastCard';
import Label from './Label';
import ContentLangChooser from './ContentLangChooser';
import { getDb } from '@/models/db';
import { useLanguage } from '@/contexts/LearnLanguageContext';
import { useActiveComponent } from '@/contexts/ActiveComponentContext';

interface MediaCard {
    id: number;
    title: string;
    author: string;
    imgurl: string;
}

interface PodcastCard {
    id: number;
    title: string;
    imageurl: string;
}

const ComponentA: React.FC = () => {
    const [mediaCards, setMediaCards] = useState<MediaCard[]>([]);
    const [podcastCards, setPodcastCards] = useState<PodcastCard[]>([]);
    const { selectedLang } = useLanguage();
    const { setActiveComponent, setSelectedPodcastId, setSelectedEpisodeId } = useActiveComponent();

    useEffect(() => {
        const fetchData = async () => {
            const supabase = await getDb();

            try {
                const { data: mediaCardsData, error: mediaError } = await supabase
                    .rpc('random_episodes', { lang_code: selectedLang.code });

                if (mediaError) {
                    console.error('Error fetching mediaCards:', mediaError);
                    return;
                }

                setMediaCards(mediaCardsData as MediaCard[]);
            } catch (error) {
                console.error('Error fetching mediaCards:', error);
            }

            try {
                const { data: podcastCardsData, error: podcastError } = await supabase
                    .rpc('random_podcasts', { lang_code: selectedLang.code });

                if (podcastError) {
                    console.error('Error fetching podcastCards:', podcastError);
                    return;
                }

                setPodcastCards(podcastCardsData as PodcastCard[]);
            } catch (error) {
                console.error('Error fetching podcastCards:', error);
            }
        };

        fetchData();
    }, [selectedLang]);

    const handleEpisodeClick = useCallback((episodeId: number) => {
        setSelectedEpisodeId(episodeId);
        setActiveComponent('viewcard');
    }, [setSelectedEpisodeId, setActiveComponent]);

    const handlePodcastClick = useCallback((podcastId: number) => {
        setSelectedPodcastId(podcastId);
        setActiveComponent('podcastdetail');
    }, [setSelectedPodcastId, setActiveComponent]);

    return (
        <div className="p-4">
            <ContentLangChooser />
            <Label
                text="episodes"
                linkUrl=""
                Icon={() => <FontAwesomeIcon icon={faPodcast} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                {mediaCards.map((card) => (
                    <EpisodeCard
                        key={card.id}
                        title={card.title}
                        author={card.author}
                        imageUrl={card.imgurl}
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
                {podcastCards.map((card) => (
                    <PodcastCard
                        key={card.id}
                        imageUrl={card.imageurl}
                        title={card.title}
                        onClick={() => handlePodcastClick(card.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ComponentA;