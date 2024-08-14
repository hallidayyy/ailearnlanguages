import React from 'react';
import DropdownFilter from './DropdownFilter'; // 确保路径正确

const SearchAndFilterBar: React.FC = () => {
  return (
    <div className="relative z-20 flex items-center justify-between w-full h-full px-3 mx-auto">
      <div className="flex items-center w-full pl-1 sm:ml-0">
        {/* SearchBar 占 1/3 的宽度 */}
        <div className="flex items-center w-1/3 h-full">
          <div className="relative flex items-center w-full group">
            <svg
              className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </svg>
            <input
              type="text"
              className="block w-full py-2.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-white text-gray-700"
              placeholder="Search"
            />
          </div>
        </div>

        {/* DropdownFilter 紧挨着 SearchBar 右侧 */}
        <div className="flex items-center ml-4">
          <DropdownFilter />
        </div>

        {/* 添加普通的 Tailwind 按钮 */}
        <div className="flex items-center ml-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;