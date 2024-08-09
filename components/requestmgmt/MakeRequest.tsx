import React, { useState, useEffect, useContext, useRef } from 'react';
import { getDb } from '@/models/db'; // 请根据实际情况调整路径
import { v4 as uuidv4 } from 'uuid'; // 导入UUID生成库
import Select from "@/components/requestmgmt/SelectOption";
import { options } from "@/lib/i18n";
import { getUserCredits } from "@/services/order";
import { AppContext } from '@/contexts/AppContext';

const MakeRequest: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [userIdInt, setUserIdInt] = useState<number | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [isCreditEnough, setIsCreditEnough] = useState<boolean>(true);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { lang, user } = useContext(AppContext);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
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

        const userCredits = await getUserCredits(user.email);
        setUserCredits(userCredits);
        if (!userCredits || userCredits < durationInMinutes) {
          setErrorMessage('Credits not enough. Please <a href="/pricing" target="_blank" rel="noopener noreferrer" style="color: #1a0dab; text-decoration: underline;">recharge</a>.');
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
    setErrorMessage(null);
    setSuccessMessage(null);
    setProcessing(true);

    if (!isAudioPlaying) {
      setErrorMessage('Please play the audio first.');
      setProcessing(false);
      return;
    }

    const taskId = uuidv4();
    const cardId = uuidv4();

    const interval_minutes = audioDuration != null ? Math.max(Math.ceil(audioDuration / 2), 1) : 1;

    try {
      const response = await fetch('/api/processPodcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioUrl: audioSrc,
          langName: selectedLanguage,
          task_id: taskId,
          card_id: cardId,
          user_id: userIdInt,
          curr_lang: lang,
          interval_minutes: 1,
          max_attempts: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Process started successfully:', data);
      } else {
        console.error('Failed to start the process:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

    const supabase = await getDb();

    if (userCredits !== null && audioDuration !== null) {
      const newCredits = userCredits - audioDuration;

      const { error: updateError } = await supabase
        .from('users')
        .update({ credit: newCredits })
        .eq('id', userIdInt);

      if (updateError) {
        console.error('Error updating user credits:', updateError);
        setErrorMessage('Error updating user credits.');
        setProcessing(false);
        return;
      }
    } else {
      setErrorMessage('User credits or audio duration is not available.');
      setProcessing(false);
      return;
    }

    setSuccessMessage('Submission successful, now go to dashboard');
    setTimeout(() => {
      window.location.href = '/showrequest';
    }, 10000);

    setProcessing(false);
  };

  const handleClear = () => {
    setAudioSrc("");
    setSelectedLanguage("");
    setAudioDuration(null);
    setIsAudioPlaying(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setProcessing(false);
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
                Paste a podcast link, then listen to it. Choose the language used in the podcast, and click on process transcription.
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
                  placeholder="Paste audio url"
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
                    Audio duration: {audioDuration} minutes, processing it will cost {audioDuration} credits.
                  </p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handleClear}
                >
                  Clear all inputs
                </button>
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handlePlayAudio}
                >
                  Play and preview
                </button>
                <button
                  type="button"
                  className="inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
                  onClick={handleProcess}
                  disabled={!isCreditEnough || processing}
                >
                  {processing ? 'Processing' : 'Process transcription'}
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