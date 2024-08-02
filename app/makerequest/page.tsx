"use client";

import React, { useState } from "react";
import MainLayout from "@/components/MainLayout";
import MakeRequest from "@/components/requestmgmt/MakeRequest";

const MainContent: React.FC = () => {
    return (
        <MainLayout>
            <MakeRequest />
        </MainLayout>
    );
};

export default MainContent;
