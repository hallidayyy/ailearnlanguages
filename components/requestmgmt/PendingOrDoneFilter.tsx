import React, { useState, useEffect, useRef } from 'react';

interface PendingOrDoneFilterProps {
  onFilterChange: (filter: string[]) => void;
  className?: string; // 添加 className 属性
}

const PendingOrDoneFilter: React.FC<PendingOrDoneFilterProps> = ({ onFilterChange, className }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['done']);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let newFilters = [...selectedFilters];

    if (value === 'pending') {
      if (checked) {
        newFilters = ['transcribed', 'pending'];
      } else {
        newFilters = newFilters.filter(filter => filter !== 'transcribed' && filter !== 'pending');
      }
    } else {
      if (checked) {
        newFilters.push(value);
      } else {
        newFilters = newFilters.filter(filter => filter !== value);
      }
    }

    // 去重
    newFilters = Array.from(new Set(newFilters));
    setSelectedFilters(newFilters);
  };

  const handleReset = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  // 计算选中的复选框数量
  const selectedCheckboxCount = (selectedFilters.includes('pending') || selectedFilters.includes('transcribed') ? 1 : 0) + (selectedFilters.includes('done') ? 1 : 0);

  return (
    <div className={`relative flex gap-8 ${className}`}>
      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
        >
          <span className="text-sm font-medium">task filter</span>
          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`h-4 w-4 ${isOpen ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-96 rounded border border-gray-200 bg-white z-50">
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">{selectedCheckboxCount} selected</span>
              <button type="button" className="text-sm text-gray-900 underline underline-offset-4" onClick={handleReset}>
                clear all
              </button>
            </header>

            <ul className="space-y-1 border-t border-gray-200 p-4">
              <li>
                <label htmlFor="FilterPending" className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="FilterPending"
                    value="pending"
                    className="size-5 rounded border-gray-300"
                    checked={selectedFilters.includes('pending') || selectedFilters.includes('transcribed')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="text-sm font-medium text-gray-700">transcription submitted</span>
                </label>
              </li>
           
              <li>
                <label htmlFor="FilterDone" className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="FilterDone"
                    value="done"
                    className="size-5 rounded border-gray-300"
                    checked={selectedFilters.includes('done')}
                    onChange={handleCheckboxChange}
                  />
                  <span className="text-sm font-medium text-gray-700">all set, you can start learning</span>
                </label>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingOrDoneFilter;