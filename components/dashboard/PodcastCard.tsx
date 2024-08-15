import React from 'react';

interface PodcastCardProps {
  imageUrl: string;
  title: string;
  onClick: () => void; // 添加 onClick 属性
}

const PodcastCard: React.FC<PodcastCardProps> = ({ imageUrl, title, onClick }) => {
  return (
    <div
      className="flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      style={{ width: '8rem', height: 'auto' }}
      onClick={onClick} // 添加点击事件处理函数
    >
      <img className="w-full h-32 object-cover" src={imageUrl} alt={title} />
      <div className="p-2 w-full">
        <h3
          className="text-left text-sm font-medium text-gray-900 w-full overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.5rem' // 确保至少两行高度
          }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
};

export default PodcastCard;