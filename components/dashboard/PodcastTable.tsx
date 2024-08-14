import React, { useState } from 'react';

interface Podcast {
  id: number;
  name: string;
  url: string;
  author: string;
  desc: string;
  imageUrl: string;
}

interface PodcastTableProps {
  podcasts: Podcast[];
  onPodcastSelect: (id: number) => void; // 用于处理 podcast 选择的回调
}

const PodcastTable: React.FC<PodcastTableProps> = ({ podcasts, onPodcastSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // console.log('Podcasts:', podcasts); // 调试输出

  // Calculate the total number of pages
  const totalPages = Math.ceil(podcasts.length / rowsPerPage);

  // Get the current data to display on the page
  const currentData = podcasts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      <div className="container max-w-8xl px-4 mx-auto sm:px-8">
        <div className="py-8">
          <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
            <h2 className="text-2xl leading-tight">Podcasts</h2>
            <hr className="my-4 border-gray-300" />
            {/* <div className="flex items-center">
              <form className="flex flex-col justify-left w-full max-w-sm space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="form-subscribe-Filter"
                    className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Name"
                  />
                </div>
                <button
                  className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                  type="submit"
                >
                  Filter
                </button>
              </form>
              <div className="flex items-center ml-auto">
                <button type="button" className="w-full px-4 py-2 text-base font-medium text-black bg-white border-t border-b border-l rounded-l-md hover:bg-gray-100">
                  Starred
                </button>
                <button type="button" className="w-full px-4 py-2 text-base font-medium text-black bg-white border hover:bg-gray-100">
                  Done
                </button>
                <button type="button" className="w-full px-4 py-2 text-base font-medium text-black bg-white border-t border-b border-r rounded-r-md hover:bg-gray-100">
                  Learned
                </button>
              </div>
            </div> */}
          </div>
          <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
            <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th scope="col" className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200">
                      name
                    </th>
                    <th scope="col" className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200">
                      author
                    </th>
                    <th scope="col" className="px-5 py-3 text-sm font-bold text-left text-gray-800 bg-white border-b border-gray-200">
                      description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((podcast) => (
                    <tr
                      key={podcast.id}
                      onClick={() => onPodcastSelect(podcast.id)} // 调用父组件传递的回调
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <a href={podcast.url} className="relative block">
                              <img
                                alt="Podcast"
                                src={podcast.imageUrl}
                                className="mx-auto object-cover rounded-full h-10 w-10"
                              />
                            </a>
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {podcast.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {podcast.author}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {podcast.desc}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg
                      width="9"
                      fill="currentColor"
                      height="8"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      type="button"
                      className={`w-full px-4 py-2 text-base ${currentPage === index + 1 ? 'text-indigo-500' : 'text-gray-600'} bg-white border-t border-b hover:bg-gray-100`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <svg
                      width="9"
                      fill="currentColor"
                      height="8"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastTable;