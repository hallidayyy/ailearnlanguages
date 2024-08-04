import React, { useState, useRef } from "react";
import { getDb } from '@/models/db'; // 请根据实际情况调整路径
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库
import { startAsyncRecognition } from '@/lib/azureSpeech'; // 导入 Azure Speech 库

const MakeRequest: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [additionalInput, setAdditionalInput] = useState<string>("");
  const [recognitionInfo, setRecognitionInfo] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.src = audioSrc;
      audioElement.play();
      audioElement.addEventListener('loadedmetadata', () => {
        const durationInMinutes = audioElement.duration / 60;
        setAudioDuration(durationInMinutes);
      });
    }
  };

  const handleProcess = async () => {
    const supabase = await getDb();

    const userId = 46; // 请根据实际情况设置 userid

    // 插入 cards 记录
    const cardId = uuidv4(); // 生成 card id
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .insert([
        {
          userid: userId,
          uuid: cardId,
          link: audioSrc,
          original: "",
          translation: "",
          keywords: "",
          keygrammer: "",
          rewritedarticle: "",
          questions: "",
          notes: "",
          likes: 0,
          generatedtitle: additionalInput,
        },
      ])
      .select('id');

    if (cardError) {
      console.error('Error inserting card:', cardError);
      return;
    }

    if (!cardData || cardData.length === 0) {
      console.error('No card data returned');
      return;
    }

    const cardIdInt = cardData[0].id; // 获取插入的 card id

    // 插入 task 记录
    const taskId = uuidv4(); // 生成 task id
    const { data: taskData, error: taskError } = await supabase
      .from('task')
      .insert([
        {
          id: taskId,
          user_id: userId,
          link: audioSrc,
          title: "Task Title", // 请根据实际情况设置 title
          status: "pending",
          card_id: cardIdInt,
        },
      ]);

    if (taskError) {
      console.error('Error inserting task:', taskError);
      return;
    }

    console.log('Task inserted successfully:', taskData);

    // 发起 Azure Speech 异步请求
    try {
      const recognitionResult = await startAsyncRecognition(audioSrc);
      setRecognitionInfo(JSON.stringify(recognitionResult, null, 2));
      console.log('Async recognition started:', recognitionResult);
    } catch (error) {
      console.error('Error starting async recognition:', error);
    }
  };

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <p className="max-w-xl text-lg">
              At the same time, the fact that we are wholly owned and totally independent from
              manufacturer and other group control gives you confidence that we will only recommend what
              is right for you.
            </p>

            <div className="mt-8">
              <a href="#" className="text-2xl font-bold text-pink-600">
                0151 475 4450
              </a>

              <address className="mt-2 not-italic">
                282 Kevin Brook, Imogeneborough, CA 58517
              </address>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form action="#" className="space-y-8">
              {/* 音频播放控件 */}
              <div className="mb-4">
                <audio ref={audioRef} controls className="w-full">
                  <source src="" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div>
                <label className="sr-only" htmlFor="audioUrl">
                  Audio URL
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                  placeholder="Enter audio URL"
                  type="text"
                  id="audioUrl"
                  name="audioUrl"
                  value={audioSrc}
                  onChange={(e) => setAudioSrc(e.target.value)}
                />
              </div>

              {/* 新增的输入框 */}
              <div>
                <label className="sr-only" htmlFor="additionalInput">
                  Additional Input
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                  placeholder="Additional Input"
                  type="text"
                  id="additionalInput"
                  name="additionalInput"
                  value={additionalInput}
                  onChange={(e) => setAdditionalInput(e.target.value)}
                />
              </div>

              {/* 显示音频时长 */}
              {audioDuration !== null && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Audio Duration: {audioDuration.toFixed(2)} minutes, processing it will cost  {audioDuration.toFixed(2)} credits.
                  </p>
                </div>
              )}

              {/* 添加额外的间距 */}
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handlePlayAudio}
                >
                  Play Audio
                </button>
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handleProcess}
                >
                  Process
                </button>
              </div>
            </form>

            {/* 显示 Azure 返回的信息 */}
            {recognitionInfo && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Azure Recognition Info:</h2>
                <pre className="whitespace-pre-wrap">{recognitionInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakeRequest;