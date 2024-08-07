import React, { useState, useRef, useEffect } from "react";
import { getDb } from '@/models/db'; // 请根据实际情况调整路径
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库
import Select from "@/components/requestmgmt/SelectOption";
import { options } from "@/lib/i18n";
import { getUserCredits } from "@/services/order";
import { respData, respErr } from "@/lib/resp";
import { select } from "@nextui-org/react";

const MakeRequest: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [additionalInput, setAdditionalInput] = useState<string>("");
  const [recognitionInfo, setRecognitionInfo] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdInt, setUserIdInt] = useState<number | null>(null); // 新增的状态变量
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 新增成功信息状态
  const [processing, setProcessing] = useState<boolean>(false); // 新增处理状态
  const [isCreditEnough, setIsCreditEnough] = useState<boolean>(true); // 新增信用是否足够的状态
  const [userCredits, setUserCredits] = useState<number | null>(null);


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    console.log('Selected value:', event.target.value);
  };

  const handlePlayAudio = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsCreditEnough(false);


    if (!audioSrc || !selectedLanguage || selectedLanguage === 'NULL') {
      setErrorMessage('Please paste an audio URL and pick a language.');
      return;
    }

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.src = audioSrc;
      try {
        await audioElement.play();
        setIsAudioPlaying(true);

        const durationInMinutes = Math.ceil(audioElement.duration / 60);
        setAudioDuration(durationInMinutes);

        // Fetch user info and credits
        const userInfoResponse = await fetch('/api/get-user-info', { method: 'POST' });
        if (!userInfoResponse.ok) throw new Error('No authentication.');

        const userInfo = await userInfoResponse.json();
        const userEmail = userInfo.data.email;

        const userCredits = await getUserCredits(userEmail);
        setUserCredits(userCredits);
        if (!userCredits || userCredits < durationInMinutes) {
          setErrorMessage('credits not enough. please <a href="/pricing" target="_blank" rel="noopener noreferrer" style="color: #1a0dab; text-decoration: underline;">recharge</a>.');
          setIsCreditEnough(false);
        } else {
          setIsCreditEnough(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsAudioPlaying(false);
        setErrorMessage('Error playing audio. Please check the URL.');
      }
    }
  };



  const handleProcess = async () => {
    setErrorMessage(null); // 清除错误信息
    setSuccessMessage(null); // 清除成功信息
    setProcessing(true); // 设置处理状态


    if (!isAudioPlaying) {
      setErrorMessage('please play the audio first.');
      setProcessing(false); // 清除处理状态
      return;
    }




    console.log("start processing");



    const taskId = uuidv4(); // 生成 task id
    console.log("task_id:" + taskId);
    console.log('audiosrc:' + audioSrc);

    console.log("send langname to uploadandtranscribe " + selectedLanguage);
    const uploadResponse = await fetch('/api/uploadAndTranscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audioUrl: audioSrc, resultFilename: taskId, langName: selectedLanguage }),
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      setErrorMessage(`Failed to process the audio file: ${errorText}`);
      setProcessing(false); // 清除处理状态
      return;
    }

    const { operationName } = await uploadResponse.json();

    if (!operationName) {
      setErrorMessage('No operation name returned.');
      setProcessing(false); // 清除处理状态
      return;
    }

    console.log('Operation started:', operationName);

    const supabase = await getDb();

    const cardId = uuidv4(); // 生成 card id
    const { data: cardData, error: cardError } = await supabase
      .from('cards')
      .insert([
        {
          userid: userIdInt,
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
      setErrorMessage('Error inserting card.');
      setProcessing(false); // 清除处理状态
      return;
    }

    if (!cardData || cardData.length === 0) {
      console.error('No card data returned');
      setErrorMessage('No card data returned.');
      setProcessing(false); // 清除处理状态
      return;
    }

    const cardIdInt = cardData[0].id;

    const { data: taskData, error: taskError } = await supabase
      .from('task')
      .insert([
        {
          id: taskId,
          user_id: userIdInt,
          link: audioSrc,
          title: "Task Title",
          status: "pending",
          card_id: cardIdInt,
          lang: selectedLanguage,
        },
      ]);

    if (taskError) {
      console.error('Error inserting task:', taskError);
      setErrorMessage('Error inserting task.');
      setProcessing(false); // 清除处理状态
      return;
    }

    console.log('Task inserted successfully:', taskData);

    const newCredits = userCredits - audioDuration;

    // 更新用户信用额度
    const { error: updateError } = await supabase
      .from('users')
      .update({ credit: newCredits })
      .eq('id', userIdInt);

    if (updateError) {
      console.error('Error updating user credits:', updateError);
      setErrorMessage('Error updating user credits.');
      setProcessing(false); // 清除处理状态
      return;
    }


    // 显示成功信息并重定向
    setSuccessMessage('submission successful, now go to dashboard');
    setTimeout(() => {
      window.location.href = '/showrequest';
    }, 2000); // 2秒后重定向

    // 后续增加一个函数去减少 credit
    console.log('Reduce credits function should be called here.');
    setProcessing(false); // 清除处理状态
  };

  const handleClear = () => {
    setAudioSrc("");
    setSelectedLanguage("");
    setAdditionalInput("");
    setAudioDuration(null);
    setIsAudioPlaying(false);
    setErrorMessage(null);
    setSuccessMessage(null); // 清除成功信息
    setProcessing(false); // 清除处理状态
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
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
            <img src="/tutorial/createtask.gif" alt="Tutorial" className="max-w-full h-auto" />

            <div className="mt-8">
              <a href="#" className="text-2xl font-bold text-pink-600">
                languepod
              </a>

              <address className="mt-2 not-italic">
                paste a podcast link, then listen to it. choose the language used in the podcast, and click on process transcription.
              </address>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form action="#" className="space-y-8">
              {errorMessage && (
                <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </span>

                    <div className="flex-1">
                      <strong className="block font-medium text-gray-900"> Error </strong>

                      <p className="mt-1 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: errorMessage }} />
                    </div>

                    <button className="text-gray-500 transition hover:text-gray-600" onClick={() => setErrorMessage(null)}>
                      <span className="sr-only">Dismiss popup</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {successMessage && (
                <div role="alert" className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>

                    <div className="flex-1">
                      <strong className="block font-medium text-gray-900"> success </strong>

                      <p className="mt-1 text-sm text-gray-700">{successMessage}</p>
                    </div>

                    <button className="text-gray-500 transition hover:text-gray-600" onClick={() => setSuccessMessage(null)}>
                      <span className="sr-only">Dismiss popup</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

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
                  placeholder="paste audio url"
                  type="text"
                  id="audioUrl"
                  name="audioUrl"
                  value={audioSrc}
                  onChange={(e) => setAudioSrc(e.target.value)}
                />
              </div>

              <div>
                <Select
                  name="HeadlineAct"
                  label=""
                  options={options}
                  placeholder="Select an option"
                  onChange={handleSelectChange}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                />
              </div>

              {audioDuration !== null && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    audio duration: {audioDuration} minutes, processing it will cost {audioDuration} credits.
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handleClear}
                >
                  clear all inputs
                </button>
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handlePlayAudio}
                >
                  play and preview
                </button>
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handleProcess}
                  disabled={!isCreditEnough || processing} // 禁用按钮当信用不足或处理中
                >
                  {processing ? 'processing' : 'process transcription'}
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