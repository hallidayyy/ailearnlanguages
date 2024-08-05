'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState('https://6a63fca904fd268f15f7-d5770ffdd579eb31eaa89faeffc55fe7.ssl.cf1.rackcdn.com/elementary-podcasts-s01-e01.mp3');
  const [operationName, setOperationName] = useState('');
  const [resultFileName, setResultFileName] = useState('');

  const handleAction = async (action: string) => {
    try {
      const res = await fetch('/api/testgoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, audioUrl, operationName, resultFileName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error}`);
      }

      const data = await res.json();
      setResponse(data);

      if (action === 'uploadAndTranscribe') {
        setOperationName(data.operationName);
      } else if (action === 'getTranscribeResult') {
        setResultFileName(data.resultFileName);
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/testgoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'downloadAudio', audioUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error}`);
      }

      const data = await res.json();
      const tempFilePath = data;

      const downloadRes = await fetch(`/api/testgoogle?filePath=${tempFilePath}`);
      const blob = await downloadRes.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audio_file.mp3');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setResponse({ message: '文件下载成功' });
    } catch (err) {
      setError(err);
    }
  };

  const handleReadCredentials = async () => {
    try {
      const res = await fetch('/api/readcredentials');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err);
    }
  };

  const handleListBuckets = async () => {
    try {
      const res = await fetch('/api/listbuckets', {
        method: 'GET',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Google Cloud Speech API Test</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Audio URL: </label>
        <input
          type="text"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Result File Name: </label>
        <input
          type="text"
          value={resultFileName}
          onChange={(e) => setResultFileName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="space-x-4">
        <button
          onClick={() => handleAction('uploadAndTranscribe')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Upload and Transcribe
        </button>
        <button
          onClick={() => handleAction('getTranscribeResult')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Get Transcribe Result
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Download Audio
        </button>
        <button
          onClick={handleReadCredentials}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Read Credentials
        </button>
        <button
          onClick={handleListBuckets}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          List Buckets
        </button>
      </div>
      {error && <div className="mt-4 text-red-500">{error.message}</div>}
      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Response</h2>
          <pre className="p-4 bg-gray-100 rounded-md">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}