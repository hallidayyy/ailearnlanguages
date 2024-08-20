import React, { useState, useContext, useEffect } from 'react';
import { useActiveComponent } from '@/contexts/ActiveComponentContext';
import { AppContext } from '@/contexts/AppContext'; // 确保路径正确
import InfoCard from '@/components/dashboard/InfoCard'; // 确保路径正确
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComputer, faHeart, faMeteor, faPodcast, faStar } from '@fortawesome/free-solid-svg-icons';
import { getReport } from '@/models/report'; // 确保路径正确

const Report: React.FC = () => {
  const { lang, user } = useContext(AppContext); // 从 AppContext 中获取 user 信息
  const [stats, setStats] = useState({
    podcastCollectionCount: 0,
    episodeCollectionCount: 0,
    registrationDate: '',
    podcastListenCount: 0,
    aiRunCount: 0,
  });

  useEffect(() => {

    if (user) {
      getReport(user.id).then(data => {
        setStats(data);
      }).catch(error => {
        console.error('Error fetching user stats:', error);
      });
    }
  }, [user]);

  return (

    <div className="flex flex-wrap gap-6 p-4">
      <div className="w-full">
        <div className="container max-w-8xl px-4 mx-auto sm:px-8">
          <div className="py-8">
            <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
              <h2 className="text-2xl leading-tight">
                report
              </h2>
            </div>
            <hr className="my-4 border-gray-300" /> {/* Horizontal line */}
            <div className="flex flex-wrap gap-6 p-4">
              <InfoCard
                title={stats.podcastCollectionCount.toString()}
                description="collected so many podcasts"
                icon={<FontAwesomeIcon icon={faStar} size="2x" className="text-blue-500" />}
                iconColor="bg-blue-200"
                titleColor="text-blue-800"
                descriptionColor="text-blue-400"
              />

              <InfoCard
                title={stats.episodeCollectionCount.toString()}
                description="collectedd so many episodes"
                icon={<FontAwesomeIcon icon={faHeart} size="2x" className="text-blue-500" />}
                iconColor="bg-blue-200"
                titleColor="text-blue-800"
                descriptionColor="text-blue-400"
              />

              <InfoCard
                title={stats.registrationDate}
                description="first time signing up"
                icon={<FontAwesomeIcon icon={faMeteor} size="2x" className="text-blue-500" />}
                iconColor="bg-blue-200"
                titleColor="text-blue-800"
                descriptionColor="text-blue-400"
              />

              <InfoCard
                title={stats.podcastListenCount.toString()}
                description="listened to so many episodes"
                icon={<FontAwesomeIcon icon={faPodcast} size="2x" className="text-blue-500" />}
                iconColor="bg-blue-200"
                titleColor="text-blue-800"
                descriptionColor="text-blue-400"
              />

              <InfoCard
                title={stats.aiRunCount.toString()}
                description="ran ai so many times"
                icon={<FontAwesomeIcon icon={faComputer} size="2x" className="text-blue-500" />}
                iconColor="bg-blue-200"
                titleColor="text-blue-800"
                descriptionColor="text-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;