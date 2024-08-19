// app/studyroom/viewcard/[id]/page.tsx
"use client";

import React from 'react';
import ViewCard from '@/components/studyroom/ViewCard'; // 确保路径正确
import MainLayout from "@/components/MainLayout";

interface ViewCardPageProps {
    params: { id: string };
}

const ViewCardPage: React.FC<ViewCardPageProps> = ({ params }) => {
    return (
        <MainLayout>
            <div className="flex justify-center items-start h-screen bg-gray-100 mt-4">
                <div className="w-4/5">
                    <ViewCard episodeId={params.id} />
                </div>
            </div>
        </MainLayout>
    );
};

export default ViewCardPage;