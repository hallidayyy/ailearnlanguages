import React, { useState } from 'react';
import Link from 'next/link';

interface TaskCardProps {
  episode: string;
  title: string;
  description: string;
  duration: string;
  featuring: string[];
  status: string;
  card_id: number; // 确保 card_id 是 number 类型
}

const TaskCard: React.FC<TaskCardProps> = ({ episode, title, description, duration, featuring, status, card_id }) => {
  const [processing, setProcessing] = useState(false);

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

  const renderButton = () => {
    switch (status) {
      case 'pending':
        return (
          <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded">Check</button>
        );
      case 'transcribed':
        return (
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" 
            onClick={handleProcess}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Process'}
          </button>
        );
      case 'done':
        return (
          <Link href={`/studyroom/viewcard/${card_id}`} legacyBehavior>
            <a className="mt-4 px-4 py-2 bg-green-500 text-white rounded">View</a>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <article className="rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
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

        <div>
          <strong
            className="rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
          >
            {episode}
          </strong>

          <h3 className="mt-4 text-lg font-medium sm:text-xl">
            <a href="#" className="hover:underline">{title}</a>
          </h3>

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

            <span className="hidden sm:block" aria-hidden="true">&middot;</span>

            <p className="mt-2 text-xs font-medium text-gray-500 sm:mt-0">
              Featuring {featuring.map((name, index) => (
                <React.Fragment key={index}>
                  <a href="#" className="underline hover:text-gray-700">{name}</a>
                  {index < featuring.length - 1 && ", "}
                </React.Fragment>
              ))}
            </p>
          </div>

          {renderButton()}
        </div>
      </div>
    </article>
  );
};

export default TaskCard;