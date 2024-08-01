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
  detectedLanguage: string; // 添加 detectedLanguage 状态
  wordCount: number; // 添加 wordCount 状态
  generatedTitle: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  onAudioSubmit,
  audioLink,
  onProcessClick,
  onFetchResult,
  link,
  onLinkChange,
  userid,
  resultCache,
  detectedLanguage,
  wordCount,
  generatedTitle,
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
            likes: 0, // 默认点赞数为0
            wordcount: wordCount,
            lang: detectedLanguage,
            generatedtitle: generatedTitle,
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
            value={link}
            onChange={handleInputChange}
            aria-label="输入链接"
            className=" w-1/2 px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            disabled
          />



          {error && <p className="text-red-600">Error: {error.message}</p>}
          {audioLink && (
            <audio controls autoPlay className="w-1/2 ml-4  bg-gray-100 rounded-lg shadow-md">
              <source src={audioLink} type="audio/mpeg" />
              您的浏览器不支持音频元素。
            </audio>
          )}
        </div>


      </div>
    </div>
  );
};

export default SubHeader;