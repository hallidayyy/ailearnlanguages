"use client";
import React, { useState } from 'react';

const AudioUploader = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (event) => {
    setAudioUrl(event.target.value);
  };

  const handleComplete = () => {
    setIsUploaded(true);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="audioFile">
          Upload Audio File
        </label>
        <input
          type="file"
          id="audioFile"
          accept="audio/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="audioUrl">
          Or Enter Audio URL
        </label>
        <input
          type="url"
          id="audioUrl"
          value={audioUrl}
          onChange={handleUrlChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleComplete}
        disabled={!audioFile && !audioUrl}
        className="w-full p-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
      >
        Complete
      </button>
      {isUploaded && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;