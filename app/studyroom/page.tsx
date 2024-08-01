"use client";

import React, { useState } from "react";
import CreateCard from "@/components/studyroom/CreateCard";
import CardTable from "@/components/studyroom/CardTable";
import MainLayout from "@/components/MainLayout";
import SideBar from "@/components/studyroom/SideBar";

const MainContent: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState("home");
    const [createCardState, setCreateCardState] = useState({ content: 'Summary', audioLink: '', extraContent: '' });
    const [cardListState, setCardListState] = useState({});

    const handleSelect = (component: string) => {
        setSelectedComponent(component);
    };

    return (
        <MainLayout>
            <div className="flex h-screen bg-white text-black"> {/* 修改背景颜色和文字颜色 */}
                <SideBar onSelect={handleSelect} />
                <main className="flex-1 flex flex-col w-full"> {/* 设置宽度为100% */}
                    <div className="flex-1 flex w-full"> {/* 确保内部 div 也占据全部宽度 */}
                        {selectedComponent === "home" && <CardTable state={cardListState} setState={setCardListState} />}
                        {selectedComponent === "play" && <CreateCard state={createCardState} setState={setCreateCardState} />}
                      
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

export default MainContent;