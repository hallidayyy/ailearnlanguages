// app/studyroom/viewcard/[id]/page.tsx
"use client";

// app/studyroom/viewcard/[id]/page.tsx
import React from 'react';
import ViewCard from '@/components/studyroom/ViewCard'; // 确保路径正确
import MainLayout from "@/components/MainLayout";


interface ViewCardPageProps {
    params: { id: string };
}

const ViewCardPage: React.FC<ViewCardPageProps> = ({ params }) => {
  

    return (
        <MainLayout>
            <div className="flex h-screen bg-gray-900 text-white">
              
                <ViewCard id={params.id} />
            </div>
        </MainLayout>
    );
};

export default ViewCardPage;