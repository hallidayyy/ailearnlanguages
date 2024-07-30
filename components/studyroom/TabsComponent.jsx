// components/TabsComponent.jsx
"use client";

import React, { useState } from 'react';

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Tab 1', content: 'Content for Tab 1' },
    { label: 'Tab 2', content: 'Content for Tab 2' },
    { label: 'Tab 3', content: 'Content for Tab 3' },
  ];

  return (
    <div className="w-full h-full bg-white shadow-md rounded-md">
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-2 px-4 focus:outline-none ${
              activeTab === index ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="h-full p-4">
        <textarea
          className="w-full h-full p-2 border border-gray-300 rounded-md resize-none"
          placeholder={tabs[activeTab].content}
        />
      </div>
    </div>
  );
};

export default TabsComponent;