// components/LongBar.tsx

import { AppContext } from '@/contexts/AppContext';
import React, { useState, useEffect, useContext } from 'react';
import { localeNames } from '@/lib/i18n'

interface LongCardProps {
    labels: string[];
    card_id: string; // 新增 card_id 属性
    card_id_fr: string;
    card_id_cn: string;
    card_id_jp: string;
    onFlagClick: (flag: string) => void; // 新增 onFlagClick 回调函数
    episode_id: string;
    onRunAIClick: (episodeId: string) => void; // 新增 onRunAIClick 回调函数
}

const LongCard: React.FC<LongCardProps> = ({ labels, card_id, card_id_fr, card_id_cn, card_id_jp, onFlagClick, episode_id, onRunAIClick }) => {
    const { lang, user } = useContext(AppContext);

    const isLanguageAvailable = (lang: string) => {
        return (
            (lang === 'en' && card_id) ||
            (lang === 'fr' && card_id_fr) ||
            (lang === 'zh' && card_id_cn) ||
            (lang === 'ja' && card_id_jp)
        );
    };

    useEffect(() => {
        if (isLanguageAvailable(lang)) {
            onFlagClick(lang === 'en' ? 'card_id' : lang === 'fr' ? 'card_id_fr' : lang === 'zh' ? 'card_id_cn' : 'card_id_jp');
        } else {
            onFlagClick('card_id'); // 默认选择英语
        }
    }, [lang, card_id, card_id_fr, card_id_cn, card_id_jp, onFlagClick]);

    const handleRunAIClick = () => {

        onRunAIClick(episode_id);

    };

    return (
        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-full">
            {/* First Row */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">This episode is available in the following languages:</div>
                <div className="flex space-x-2">
                    {card_id && (
                        <button
                            className="px-2 py-1 bg-gray-200 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => onFlagClick('card_id')}
                        >
                            🇺🇸
                        </button>
                    )}
                    {card_id_fr && (
                        <button
                            className="px-2 py-1 bg-gray-200 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => onFlagClick('card_id_fr')}
                        >
                            🇫🇷
                        </button>
                    )}
                    {card_id_cn && (
                        <button
                            className="px-2 py-1 bg-gray-200 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => onFlagClick('card_id_cn')}
                        >
                            🇨🇳
                        </button>
                    )}
                    {card_id_jp && (
                        <button
                            className="px-2 py-1 bg-gray-200 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => onFlagClick('card_id_jp')}
                        >
                            🇯🇵
                        </button>
                    )}
                </div>
            </div>

            {/* Third Row */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">

                    {isLanguageAvailable(lang) ? (
                        `Your language ${localeNames[lang]} is available`
                    ) : (
                        `So you wanna run AI on your native language ${localeNames[lang]}`
                    )}
                </div>
                {!isLanguageAvailable(lang) && (
                    <button onClick={handleRunAIClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Run AI
                    </button>
                )}
            </div>
        </div>
    );
};

export default LongCard;