"use client";


import { AppContext } from '@/contexts/AppContext';
import React, { useState, useEffect, useContext, useRef } from 'react';


interface SubHeaderProps {
  episodeData?: {
    id: string; // 确保 episodeData 包含 id
    title: string;
    description: string;
    published_at: string; // ISO 日期字符串
    imageUrl: string;
    audioUrl: string;
    card_id: string; // 新增 card_id 属性
    card_id_fr: string;
    card_id_cn: string;
    card_id_jp: string;
  };
  isFavorited: boolean;
  onFavoriteClick?: (episodeId: string) => void; // 传递一个回调函数来处理收藏操作
  onRunAIClick?: (episodeId: string) => void; // 新增 onRunAIClick 回调函数
}

const SubHeader: React.FC<SubHeaderProps> = ({ episodeData, isFavorited, onFavoriteClick, onRunAIClick }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { lang, user } = useContext(AppContext);

  useEffect(() => {
    console.log('Rendering SubHeader component');
    console.log(episodeData?.card_id);

    if (episodeData?.audioUrl && audioRef.current) {
      audioRef.current.load(); // 加载音频
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (audioRef.current) {
        switch (event.key) {
          case ' ': // 空格键
            event.preventDefault();
            if (audioRef.current.paused) {
              audioRef.current.play();
            } else {
              audioRef.current.pause();
            }
            break;
          case 'k': // 'k' 键
            event.preventDefault();
            if (audioRef.current.paused) {
              audioRef.current.play();
            } else {
              audioRef.current.pause();
            }
            break;
          case 'ArrowRight': // 右箭头键
            event.preventDefault();
            audioRef.current.currentTime += 10; // 快进 10 秒
            break;
          case 'ArrowLeft': // 左箭头键
            event.preventDefault();
            audioRef.current.currentTime -= 10; // 后退 10 秒
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [episodeData?.audioUrl]);

  const handleFavoriteClick = () => {
    if (episodeData && onFavoriteClick) {
      onFavoriteClick(episodeData.id);
    }
  };

  const handleRunAIClick = () => {
    if (typeof onRunAIClick === 'function' && episodeData && episodeData.id !== undefined) {
      onRunAIClick(episodeData.id);
    } else {
      console.error('onRunAIClick is not a function or episodeData.id is undefined');
    }
  };


  return (
    <div className="flex items-start justify-between bg-white text-black py-4 w-full px-4">
      {episodeData && (
        <>
          <div className="w-1/4 flex flex-col items-center justify-center">
            <img
              src={episodeData.imageUrl}
              alt={episodeData.title}
              className="w-48 h-48 object-cover rounded-lg"
            />
            <button
              onClick={handleFavoriteClick}
              className={`mt-2 px-4 py-2 rounded-lg ${isFavorited ? 'text-red-500' : 'text-gray-500'}`}
            >
              {isFavorited ? (
                <svg className="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>

            {/* {(episodeData.card_id === null) && (
              <button
                onClick={handleRunAIClick}
                className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Run AI
              </button>
            )} */}
          </div>
          <div className="w-3/4 flex flex-col justify-between pl-4 h-48">
            <div className="flex-none">
              <h2 className="text-xl font-bold">{episodeData.title}</h2>
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <div className="max-h-12 overflow-hidden">
                <p className="text-gray-600">{episodeData.description}</p>
              </div>
              <p className="text-gray-500">
                {new Date(episodeData.published_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex-none mt-auto">
              <audio ref={audioRef} controls className="w-full bg-gray-100 rounded-lg shadow-md">
                <source src={episodeData.audioUrl} type="audio/mpeg" />
                您的浏览器不支持音频元素。
              </audio>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubHeader;