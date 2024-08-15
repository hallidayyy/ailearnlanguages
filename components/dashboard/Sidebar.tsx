// components/dashboard/Sidebar.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faFlag, faReceipt, faPodcast, faBoxArchive, faHouseUser, faGauge } from '@fortawesome/free-solid-svg-icons';
import { useActiveComponent } from '@/contexts/ActiveComponentContext';

const navItems = [
    { id: 'explore', icon: faHouseUser, label: 'explore' },
    { id: 'episodes', icon: faBoxArchive, label: 'episodes' },
    { id: 'podcasts', icon: faPodcast, label: 'podcasts' },
    { id: 'plan', icon: faReceipt, label: 'plan' },
    { id: 'reports', icon: faFlag, label: 'reports' },
    { id: 'settings', icon: faSliders, label: 'settings' },
];

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState('explore');
    const { setActiveComponent } = useActiveComponent();

    const handleNavItemClick = (id: string) => {
        setActiveItem(id);
        setActiveComponent(id);
    };

    return (
        <div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
            <div className="h-full bg-white rounded-2xl dark:bg-gray-200">
                <div className="flex items-center justify-center pt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 text-gray-600">
                        <path d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z" />
                    </svg>
                </div>
                <nav className="mt-6">
                    <div>
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                className={`flex items-center justify-start w-full p-4 my-2 font-thin transition-colors duration-200 ${activeItem === item.id
                                    ? 'text-blue-500 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800'
                                    : 'text-gray-500 dark:text-gray-200 hover:text-blue-500'
                                    }`}
                                href="#"
                                onClick={() => handleNavItemClick(item.id)}
                            >
                                <span className="text-left">
                                    <FontAwesomeIcon icon={item.icon} />
                                </span>
                                <span className="mx-4 text-sm font-normal">
                                    {item.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;