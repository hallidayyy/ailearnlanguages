import { faPercentage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div className="relative p-4 overflow-hidden text-gray-700 bg-white shadow-2xl rounded-xl w-60 md:w-72 dark:bg-gray-800 dark:text-gray-100">
      <div className="w-full">
        {/* Flexbox container for icon and title */}
        <div className="flex items-center mb-6">
          <span className="p-2 text-2xl text-purple-500">
            <FontAwesomeIcon icon={faPercentage} />
          </span>
          <p className="ml-2 text-black text-md dark:text-white">
            {title}
          </p>
        </div>

        {usage.map((usage, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <p>{usage.name}</p>
              <p>{usage.used}/{usage.total}</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
              <div
                className={`h-full text-xs text-center text-white rounded-full ${usage.colorClass}`}
                style={{ width: `${(usage.used / usage.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          if it shows you have 9999 quotas, it means your quota is unlimited.
        </div>
      </div>
    </div>
  );
};

export default UsageCard;