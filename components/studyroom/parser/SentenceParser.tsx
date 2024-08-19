import React, { useState, useEffect, useRef } from 'react';

// 定义 JSON 数据的接口
interface TranscriptAlternative {
  startOffset: string;
  endOffset: string;
  confidence?: number;
  transcript: string;
}

interface TranscriptResult {
  alternatives: TranscriptAlternative[];
}

interface TranscriptData {
  results: TranscriptResult[];
}

// 音频播放函数
const playAudio = (startTime: number, endTime: number, audioRef: React.RefObject<HTMLAudioElement>) => {
  if (!audioRef.current) {
    console.error('Audio element is not available');
    return;
  }

  if (!audioRef.current.paused) {
    audioRef.current.pause();
  }

  if (isNaN(startTime) || isNaN(endTime)) {
    console.error('Invalid startTime or endTime');
    return;
  }

  audioRef.current.currentTime = startTime;
  audioRef.current.play();

  setTimeout(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, (endTime - startTime) * 1000);
};

interface SentenceParserProps {
  sentence: string;
  audio_url: string;
}

const SentenceParser: React.FC<SentenceParserProps> = ({ sentence, audio_url }) => {

  const [data, setData] = useState<TranscriptResult[]>([]);
  const [hoverIndex, setHoverIndex] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 解析 sentence 变量
  useEffect(() => {
    try {
      const jsonData: TranscriptData = JSON.parse(sentence);
      if (Array.isArray(jsonData.results)) {
        setData(jsonData.results);
      } else {
        console.error('Invalid JSON format');
      }
    } catch (error) {
      console.error('Error parsing sentence:', error);
    }
  }, [sentence]);

  // 播放整个 transcript 的音频
  const handlePlayTranscript = (startTime: string, endTime: string) => {
    const startTimeFloat = parseFloat(startTime);
    const endTimeFloat = parseFloat(endTime);

    if (isNaN(startTimeFloat) || isNaN(endTimeFloat)) {
      console.error('Invalid startTime or endTime');
      return;
    }

    playAudio(startTimeFloat, endTimeFloat, audioRef);
  };

  // 渲染 JSON 数据
  return (
    <div>
      <audio ref={audioRef} src={audio_url}></audio>
      {data.map((result, resultIndex) => (
        <div key={resultIndex} className="mb-4">
          {Array.isArray(result.alternatives) && result.alternatives.length > 0 ? (
            result.alternatives.map((alternative, altIndex) => (
              <div
                key={altIndex}
                className="inline-flex items-center bg-gray-100 leading-none rounded-full p-2 shadow text-sm"
                style={{
                  cursor: 'pointer',
                  backgroundColor: hoverIndex === `${resultIndex}-${altIndex}` ? '#e5e7eb' : 'transparent',
                  lineHeight: '1.5', // 设置行间距
                }}
                onClick={() => handlePlayTranscript(alternative.startOffset, alternative.endOffset)}
                onMouseEnter={() => setHoverIndex(`${resultIndex}-${altIndex}`)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <span className="inline-flex bg-gray-600 text-white rounded-full h-6 px-3 justify-center items-center">
                  {alternative.confidence !== undefined ? alternative.confidence.toFixed(2) : 'transcript'}
                </span>
                <span className="inline-flex px-2 text-gray-600">
                  {alternative.transcript}
                </span>
              </div>
            ))
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default SentenceParser;