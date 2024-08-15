import React from 'react';

interface EpisodeCardProps {
  title: string;
  author: string;
  imageUrl: string;
  onClick: () => void; // 添加 onClick 属性
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ title, author, imageUrl, onClick }) => {
  return (
    <div 
      className="flex items-center bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick} // 添加点击事件处理函数
    >
      <div className="flex-shrink-0 p-4">
        <img className="h-24 w-24 object-cover rounded-md" src={imageUrl} alt={title} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{author}</p>
      </div>
    </div>
  );
};

export default EpisodeCard;