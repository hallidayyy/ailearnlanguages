"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { getDb } from '@/models/db'; // 替换为你的 getDb 函数路径
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库

interface SubHeaderProps {
  onAudioSubmit: (link: string) => void;
  audioLink: string;
  onProcessClick: () => void;
  onFetchResult: (result: string) => void;
  link: string; // 添加 link 状态
  onLinkChange: (link: string) => void; // 添加处理 link 改变的函数
  userid: string; // 添加 userid 状态
  resultCache: {
    Original: string;
    Translate: string;
    KeyWords: string;
    KeyGrammer: string;
    RewriteArticle: string;
    Questions: string;
    ExportNotes: string;
  };
}

const SubHeader: React.FC<SubHeaderProps> = ({ 
  onAudioSubmit, 
  audioLink, 
  onProcessClick, 
  onFetchResult, 
  link, 
  onLinkChange, 
  userid, 
  resultCache 
}) => {
  const [isAudio, setIsAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onLinkChange(event.target.value);
  }, [onLinkChange]);

  const handleSubmit = useCallback(() => {
    const audioExtensions = ['.mp3', '.wav', '.ogg'];
    const extension = link.substring(link.lastIndexOf('.')).toLowerCase();

    if (audioExtensions.includes(extension)) {
      setIsAudio(true);
      onAudioSubmit(link);
    } else {
      alert('请输入一个有效的音频链接。');
      setIsAudio(false);
    }
  }, [link, onAudioSubmit]);

  const handleSaveClick = async () => {
    if (!resultCache) {
      setError(new Error('ResultCache is undefined'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const supabase = await getDb();
      const { data, error } = await supabase
        .from('cards')
        .insert([
          {
     
            uuid: uuidv4(),
            link: link,
            original: resultCache.Original,
            translation: resultCache.Translate,
            keywords: resultCache.KeyWords,
            keygrammer: resultCache.KeyGrammer,
            rewritedarticle: resultCache.RewriteArticle,
            questions: resultCache.Questions,
            notes: resultCache.ExportNotes,
            likes: 0 // 默认点赞数为0
          }
        ]);

      if (error) {
        throw error;
      }

      console.log('Data saved successfully:', data);
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Rendering SubHeader component');
  }, []);

  console.log('Rendering SubHeader with link:', link, 'isAudio:', isAudio);

  return (
    <div className="flex items-center justify-center bg-white text-black py-4 w-full">
      <div className="w-full space-y-4 px-4">
        <div className="flex items-center space-x-2 w-full">
          <input
            type="url"
            placeholder="输入链接"
            value={link} // 使用 link 状态
            onChange={handleInputChange}
            aria-label="输入链接"
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            提交
          </button>
          <button
            onClick={onProcessClick}
            className="rounded-md bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-500"
          >
            处理
          </button>
          <button
            onClick={handleSaveClick}
            className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {loading ? 'Saving...' : 'Save Data'}
          </button>
          {error && <p className="text-red-600">Error: {error.message}</p>}
          {audioLink && (
            <audio controls autoPlay className="ml-4 flex-1">
              <source src={audioLink} type="audio/mpeg" />
              您的浏览器不支持音频元素。
            </audio>
          )}
        </div>
        <p className="text-center text-sm text-gray-500">输入一个链接进行处理。</p>
      </div>
    </div>
  );
};

export default SubHeader;