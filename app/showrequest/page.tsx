"use client";

import React, { useState } from "react";
import MainLayout from "@/components/MainLayout";
import ShowRequest from "@/components/requestmgmt/ShowRequest";

const MainContent: React.FC = () => {
    return (
        <MainLayout>
            <ShowRequest />
        </MainLayout>
    );
};

export default MainContent;
