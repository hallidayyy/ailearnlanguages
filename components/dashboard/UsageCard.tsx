import React from 'react';

interface Usage {
  name: string;
  used: number;
  total: number;
  colorClass: string;
}

interface UsageCardProps {
  title: string;
  usage: Usage[];
}

const UsageCard: React.FC<UsageCardProps> = ({ title, usage }) => {
  return (
    <div className="relative p-4 overflow-hidden text-gray-700 bg-white shadow-lg rounded-xl w-60 md:w-72 dark:bg-gray-800 dark:text-gray-100">
      <div className="w-full">
        <p className="mb-4 text-2xl font-light text-gray-700 dark:text-white">
          {title}
        </p>
        
        {usage.map((usage, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <p>{usage.name}</p>
              <p>{usage.used}/{usage.total}</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div
                className={`h-full text-xs text-center text-white rounded-full ${usage.colorClass}`}
                style={{ width: `${(usage.used / usage.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageCard;