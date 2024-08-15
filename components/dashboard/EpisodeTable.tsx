import React, { useState } from 'react';
import ViewCard from '@/components/studyroom/ViewCard'; // 确保路径正确

interface Episode {
    id: string;
    title: string;
    podcast_id: string;
    published_at: string;
    status: string;
    imgurl: string;
    audiourl: string;
    description: string;
    card_id: string;
    card_id_fr: string;
    card_id_cn: string;
    card_id_jp: string;

}

interface EpisodeTableProps {
    episodes: Episode[];
}

const EpisodeTable: React.FC<EpisodeTableProps> = ({ episodes }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
    const rowsPerPage = 6;
    const totalPages = Math.ceil(episodes.length / rowsPerPage);
    const pageRange = 2; // 显示的页码范围

    const currentData = episodes.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleEpisodeClick = (episodeId: string) => setSelectedEpisodeId(episodeId);

    // 创建页码数组
    const getPaginationArray = () => {
        let startPage = Math.max(currentPage - pageRange, 1);
        let endPage = Math.min(currentPage + pageRange, totalPages);

        if (endPage - startPage < 2 * pageRange) {
            if (startPage === 1) {
                endPage = Math.min(2 * pageRange + 1, totalPages);
            } else if (endPage === totalPages) {
                startPage = Math.max(totalPages - 2 * pageRange, 1);
            }
        }

        const pages: (number | string)[] = [];
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };


    const getFlagEmoji = (card_id: string, lang: string) => {
        console.log("card id:" + card_id)

        if (card_id !== targetId || lang == 'english') return '🇺🇸';
        if (card_id !== targetId || lang == 'french') return '🇫🇷';
        if (card_id !== targetId || lang == 'chinese') return '🇨🇳';
        if (card_id !== targetId || lang == 'japanese') return '🇯🇵';
        return '';
    };

    return (
        <div className="w-full">
            {selectedEpisodeId ? (
                <ViewCard episodeId={selectedEpisodeId} />
            ) : (
                <div className="container max-w-8xl px-4 mx-auto sm:px-8 py-8">
                    <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
                        <h2 className="text-2xl leading-tight">
                            episodes
                        </h2>
                        <hr className="my-4 border-gray-300" /> {/* Horizontal line */}
                    </div>
                    <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
                        <table className="min-w-full leading-normal table-fixed" style={{ width: '1000px' }}>
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200 w-1/4">episode</th>
                                    <th className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200 w-1/2">description</th>
                                    <th className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200 w-1/8">created at</th>
                                    <th className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200 w-1/8">available in</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map(episode => (
                                    <tr key={episode.id} onClick={() => handleEpisodeClick(episode.id)} className="cursor-pointer hover:bg-gray-100">
                                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 w-1/4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <a href="#" className="relative block">
                                                        <img
                                                            alt="episode"
                                                            src={episode.imgurl}
                                                            className="mx-auto object-cover rounded-full h-10 w-10"
                                                        />
                                                    </a>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-normal overflow-hidden text-ellipsis">
                                                        {episode.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <p className="text-gray-900" title={episode.description}>{episode.description}</p>
                                        </td>
                                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <p className="text-gray-900">{new Date(episode.published_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-5 py-5 text-sm bg-white border-b border-gray-200" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <span className={`relative inline-block px-3 py-1 font-semibold leading-tight`}>
                                                {episode.card_id ? '🇺🇸' : ''}{episode.card_id_fr ? '🇫🇷' : ''}{episode.card_id_cn ? '🇨🇳' : ''}{episode.card_id_jp ? '🇯🇵' : ''}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-center items-center px-5 py-5 bg-white">
                            <button
                                className="px-3 py-2 text-base text-gray-600 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 flex items-center"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 1792 1792">
                                    <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" />
                                </svg>
                            </button>
                            {getPaginationArray().map((page, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-2 text-base ${currentPage === page ? 'text-indigo-500 border-indigo-500' : 'text-gray-600 border-gray-300'} border ${index === 0 ? 'rounded-l-lg' : index === getPaginationArray().length - 1 ? 'rounded-r-lg' : ''} hover:bg-gray-100`}
                                    onClick={() => page !== '...' && handlePageChange(Number(page))}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="px-3 py-2 text-base text-gray-600 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 flex items-center"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 1792 1792">
                                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EpisodeTable;