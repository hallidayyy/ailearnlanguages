// pages/index.tsx

"use client"

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import DashboardContent from '@/components/dashboard/DashboardContent';
import MainLayout from "@/components/MainLayout";
import { ActiveComponentProvider } from '@/contexts/ActiveComponentContext';
import { LanguageProvider } from '@/contexts/LearnLanguageContext';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <LanguageProvider>
        <ActiveComponentProvider>
          <div className="relative h-[110vh] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <div className="flex items-start justify-between ">
              <Sidebar />
              <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
                <DashboardContent />
              </div>
            </div>
          </div>
        </ActiveComponentProvider>
      </LanguageProvider>
    </MainLayout>
  );
};

export default DashboardPage;