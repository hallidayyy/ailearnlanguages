import React, { useState, useRef, useEffect } from "react";
import { getDb } from '@/models/db'; // 请根据实际情况调整路径
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库
import { startAsyncRecognition } from '@/lib/azureSpeech'; // 导入 Azure Speech 库
import Select from "@/components/requestmgmt/SelectOption";
import { options } from "@/lib/i18n";

const MakeRequest: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [additionalInput, setAdditionalInput] = useState<string>("");
  const [recognitionInfo, setRecognitionInfo] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdInt, setUserIdInt] = useState<number | null>(null); // 新增的状态变量
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    console.log('Selected value:', event.target.value);
  };

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
    if (!userIdInt) {
      console.error('User ID is not available');
      return;
    }
    const taskId = uuidv4(); // 生成 task id
    console.log("task_id:" + taskId);
    console.log('audiosrc:' + audioSrc);
    // 开始 upload and transcribe

    const response = await fetch('/api/uploadAndTranscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audioUrl: audioSrc, resultFilename: taskId }), // 移除多余的逗号
    });

    if (!response.ok) {
      const errorText = await response.text(); // 获取错误信息
      throw new Error(`Failed to process the audio file: ${errorText}`);
    }

    const { operationName } = await response.json();

    if (!operationName) {
      throw new Error('No operation name returned');
    }

    // 处理成功的操作名称
    console.log('Operation started:', operationName);











    const supabase = await getDb();

    // 插入 cards 记录
    const cardId = uuidv4(); // 生成 card id
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .insert([
        {
          userid: userIdInt, // 使用 userIdInt
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

    const { data: taskData, error: taskError } = await supabase
      .from('task')
      .insert([
        {
          id: taskId,
          user_id: userIdInt, // 使用 userIdInt
          link: audioSrc,
          title: "Task Title", // 请根据实际情况设置 title
          status: "pending",
          card_id: cardIdInt,
          lang: selectedLanguage, // 更新选择的语言
        },
      ]);

    if (taskError) {
      console.error('Error inserting task:', taskError);
      return;
    }

    console.log('Task inserted successfully:', taskData);


  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/get-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setUserId(data.data.uuid);
          //console.log("uuid tmd:"+data.data.uuid);

          // 通过 uuid 获取 users 表格中的 id
          const supabase = await getDb();
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('uuid', data.data.uuid)
            .single();

          if (userError) {
            console.error('Error fetching user id:', userError);
          } else {
            setUserIdInt(userData.id);
          }
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <p className="max-w-xl text-lg">
              Learning a language may not be very difficult. You just need to choose a podcast, listen to it repeatedly, read along while imitating, and try to understand each word and grammar point.
              Perhaps after a few times, you might master the language. This is also the most natural and human-centered way to learn a language.
            </p>

            <div className="mt-8">
              <a href="#" className="text-2xl font-bold text-pink-600">
                LinguaPod
              </a>

              <address className="mt-2 not-italic">
                Insert a podcast link, then listen to it. Choose the language used in the podcast, and click on “Transcribe.”
              </address>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form action="#" className="space-y-8">
              {/* 显示用户 ID
              {userId && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">User ID: {userId}</p>
                </div>
              )}

              {userId && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">User ID: {userIdInt}</p>
                </div>
              )} */}




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

              {/* 新增的输入框
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
              </div> */}

              <div>
                <Select
                  name="HeadlineAct"
                  label="podcasts language"
                  options={options}
                  placeholder="Select an option"
                  onChange={handleSelectChange}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
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


          </div>
        </div>
      </div>
    </section>
  );
};

export default MakeRequest;