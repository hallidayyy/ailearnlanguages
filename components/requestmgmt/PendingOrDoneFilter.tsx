import React, { useState } from 'react';

const PendingOrDoneFilter: React.FC<{ onFilterChange: (filter: string[]) => void }> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let newFilters = [...selectedFilters];
    if (checked) {
      newFilters.push(value);
    } else {
      newFilters = newFilters.filter(filter => filter !== value);
    }
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="flex gap-8">
      <div className="relative">
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
            <span className="text-sm font-medium">Availability</span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </summary>

          <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
            <div className="w-96 rounded border border-gray-200 bg-white">
              <header className="flex items-center justify-between p-4">
                <span className="text-sm text-gray-700">{selectedFilters.length} Selected</span>
                <button type="button" className="text-sm text-gray-900 underline underline-offset-4" onClick={handleReset}>
                  Reset
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
                      checked={selectedFilters.includes('pending')}
                      onChange={handleCheckboxChange}
                    />
                    <span className="text-sm font-medium text-gray-700">Pending</span>
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
                    <span className="text-sm font-medium text-gray-700">Done</span>
                  </label>
                </li>

                <li>
                  <label htmlFor="FilterTranscribed" className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="FilterTranscribed"
                      value="transcribed"
                      className="size-5 rounded border-gray-300"
                      checked={selectedFilters.includes('transcribed')}
                      onChange={handleCheckboxChange}
                    />
                    <span className="text-sm font-medium text-gray-700">Transcribed</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PendingOrDoneFilter;