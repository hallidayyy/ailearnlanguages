import React, { useState, useEffect, useRef } from 'react';

// 音频播放函数
const playAudio = (startTime, endTime, audioRef) => {
  if (audioRef.current && !audioRef.current.paused) {
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

const OriginalContentParser = () => {
  const [data, setData] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const audioRef = useRef(null);

  // 指定 JSON 文件的 URL
  const jsonUrl = '/test/RealEasyEnglishTalkingAboutSchool.json'; // 这里使用 public 文件夹中的路径

  // 获取 JSON 数据
  useEffect(() => {
    fetch(jsonUrl)
      .then(response => response.json())
      .then(jsonData => {
        if (Array.isArray(jsonData.results)) {
          setData(jsonData.results);
        } else {
          console.error('Invalid JSON format');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // 播放整个 transcript 的音频
  const handlePlayTranscript = (startTime, endTime) => {
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
      <audio ref={audioRef} src="/test/LearningEasyEnglish-20240809-RealEasyEnglishTalkingAboutSchool.mp3"></audio>
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

export default OriginalContentParser;