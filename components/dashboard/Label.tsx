import React from 'react';
import { IconType } from 'react-icons';

interface LabelProps {
  text: string;
  linkUrl: string;
  Icon: IconType;
}

const Label: React.FC<LabelProps> = ({ text, linkUrl, Icon }) => {
  return (
    <div className="mt-4 mb-4">
      <a
        href={linkUrl}
        className="flex items-center text-gray-800 hover:text-gray-900 group">
        <span className="mr-2">
          <Icon />
        </span>
        <span className="font-medium text-left flex-1 overflow-hidden text-ellipsis line-clamp-2">
          {text}
          <span className="inline-block transform transition-transform duration-200 ease-in-out group-hover:translate-x-1">
            ›
          </span>
        </span>
      </a>
    </div>
  );
};

export default Label;