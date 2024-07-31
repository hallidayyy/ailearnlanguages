"use client";

import React, { useState, useCallback, useEffect } from 'react';

interface SubHeaderProps {
  onAudioSubmit: (link: string) => void;
  audioLink: string;
  onProcessClick: () => void;
  onFetchResult: (result: string) => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({ onAudioSubmit, audioLink, onProcessClick, onFetchResult }) => {
  const [link, setLink] = useState('');
  const [isAudio, setIsAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  }, []);

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

  const handleFetchClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: '给我讲一个笑话', maxTokens: 150 }),
      });

      const data = await response.json();
      onFetchResult(data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching data:', error);
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
            onClick={handleFetchClick}
            className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
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