import React from 'react';

interface PodcastCardVerticalProps {
  title: string;
  desc: string;
  imgurl: string;
  isFavorited: boolean;
  onFavoriteClick: () => void;
}

const PodcastCardVertical: React.FC<PodcastCardVerticalProps> = ({ title, desc, imgurl, isFavorited, onFavoriteClick }) => {
  return (
    <div className="w-full px-4">
      <div className="flex overflow-hidden bg-white rounded-lg shadow-lg mx-auto max-w-3xl">
        <div
          className="w-1/3 bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${imgurl})`, backgroundSize: 'contain' }}
        ></div>
        <div className="w-2/3 p-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">{desc}</p>
          <div className="flex justify-between mt-3 items-center">
            <button onClick={onFavoriteClick} className={isFavorited ? 'text-red-500' : 'text-gray-500'}>
              {isFavorited ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCardVertical;