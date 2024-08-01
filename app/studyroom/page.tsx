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
            <div className="flex h-screen bg-gray-900 text-white">
                <SideBar onSelect={handleSelect} />
                <main className="flex-1 flex flex-col">
                    <div className="flex-1 flex">
                        {selectedComponent === "home" && <CardTable state={cardListState} setState={setCardListState} />}
                        {selectedComponent === "play" && <CreateCard state={createCardState} setState={setCreateCardState} />}
                        {selectedComponent === "settings" && <div>Settings Content</div>}
                        {selectedComponent !== "home" && selectedComponent !== "play" && selectedComponent !== "settings" && <div>Default Content</div>}
                    </div>
                </main>
            </div>
        </MainLayout>
    );
};

export default MainContent;
