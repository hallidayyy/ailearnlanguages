import { AppContext } from '@/contexts/AppContext';
import React, { useState, useEffect, useContext } from 'react';
import { localeNames } from '@/lib/i18n'
import { toast, ToastContainer } from 'react-toastify';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog'; // 确保路径正确

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
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmRunAI = () => {
        setIsConfirmDialogOpen(false);
        onRunAIClick(episode_id);
    };

    return (
        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-full">
            <div className="flex flex-col mb-4">
                {/* Display language buttons if at least one variable is present */}
                {(card_id || card_id_fr || card_id_cn || card_id_jp) ? (
                    <>
                        <div className="flex items-center space-x-2">
                            <div className="text-lg font-semibold text-gray-600">This episode is available in the following languages:</div>
                            <div className="flex space-x-2">
                                {card_id && (
                                    <button
                                        className="px-2 py-1  text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => onFlagClick('card_id')}
                                    >
                                        🇺🇸
                                    </button>
                                )}
                                {card_id_fr && (
                                    <button
                                        className="px-2 py-1  text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => onFlagClick('card_id_fr')}
                                    >
                                        🇫🇷
                                    </button>
                                )}
                                {card_id_cn && (
                                    <button
                                        className="px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => onFlagClick('card_id_cn')}
                                    >
                                        🇨🇳
                                    </button>
                                )}
                                {card_id_jp && (
                                    <button
                                        className="px-2 py-1  text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={() => onFlagClick('card_id_jp')}
                                    >
                                        🇯🇵
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* <div className="flex items-center text-lg font-semibold text-gray-600">
                            <span>, you can click on the language dropdown menu at the top of the screen to select your native language.</span>
                        </div> */}
                    </>
                ) : (
                    <div className="text-lg font-semibold text-gray-600">
                        no languages are available for this episode.
                    </div>
                )}
            </div>

            <div className="flex justify-start items-center">
                <div className="text-lg font-semibold text-gray-600 ">
                    {isLanguageAvailable(lang) ? (
                        `your language ${localeNames[lang]} is available`
                    ) : (
                        `you wanna run ai on your native language ${localeNames[lang]} , you can click the "run ai" button to generate podcast learning materials in your native language`
                    )}
                </div>

                {!isLanguageAvailable(lang) && (
                    <button
                        onClick={handleRunAIClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
                    >
                        run ai
                    </button>
                )}
            </div>

            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmRunAI}
                title="confirm run ai"
                message={`running ai on ${localeNames[lang]} will deduct one of your 'run ai' quotas.`}
                confirmText="yes, run"
                cancelText="no, cancel"
            />
        </div>
    );
};

export default LongCard;