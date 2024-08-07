import React, { useState } from 'react';
import Link from 'next/link';

interface TaskCardProps {
  episode: string;
  title: string;
  description: string;
  duration: string;
  featuring: string[];
  status: string;
  card_id: number;
  curr_lang: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ episode, title, description, duration, featuring, status, card_id, curr_lang }) => {
  const [processing, setProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: card_id,
          curr_lang: curr_lang,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error processing transcribed text: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error processing transcribed text:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheck = async () => {
    try {
      const response = await fetch('/api/getTranscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskid: episode }), // 使用 card_id 作为 taskid
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching transcription: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.transcription) {
        setTranscription(data.transcription);
      } else {
        alert('transcription result has not been generated yet. please try again later.');
      }
    } catch (error) {
      console.error('Error fetching transcription:', error);
    }
  };

  const renderButton = () => {
    switch (status) {
      case 'pending':
        return (
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={handleCheck} // 点击 Check 按钮时调用 handleCheck
          >
            check
          </button>
        );
      case 'transcribed':
        return (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleProcess}
            disabled={processing}
          >
            {processing ? 'processing...' : 'process'}
          </button>
        );
      case 'done':
        return (
          <Link href={`/studyroom/viewcard/${card_id}`} legacyBehavior>
            <a className="px-4 py-2 bg-green-500 text-white rounded">view</a>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <article className="relative rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
      <div className="flex items-start sm:gap-8">
        <div
          className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-indigo-500"
          aria-hidden="true"
        >
          <div className="flex items-center gap-1">
            <span className="h-8 w-0.5 rounded-full bg-indigo-500"></span>
            <span className="h-6 w-0.5 rounded-full bg-indigo-500"></span>
            <span className="h-4 w-0.5 rounded-full bg-indigo-500"></span>
            <span className="h-6 w-0.5 rounded-full bg-indigo-500"></span>
            <span className="h-8 w-0.5 rounded-full bg-indigo-500"></span>
          </div>
        </div>

        <div className="flex-1">
          <strong
            className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
          >
          task id:  {episode}
          </strong>

      

          <p className="mt-1 text-sm text-gray-700">
            {description}
          </p>

          <div className="mt-4 sm:flex sm:items-center sm:gap-2">
            <div className="flex items-center gap-1 text-gray-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <p className="text-xs font-medium">{duration}</p>
            </div>
          </div>

          {/* 显示转录内容（如果有的话） */}
          {transcription && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
             
              <p>transcription is complete, please proceed with ai.</p>
            </div>
          )}
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {renderButton()}
        </div>
      </div>
    </article>
  );
};

export default TaskCard;