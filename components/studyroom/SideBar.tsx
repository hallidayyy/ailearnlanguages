// components/Sidebar.tsx
import React from "react";
import { HomeIcon, MenuIcon, PlayIcon, SettingsIcon } from "./Icons";

interface SidebarProps {
  onSelect: (component: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  return (
    <aside className="w-16 bg-white flex flex-col items-center py-4 border-r border-gray-300">
      <button onClick={() => onSelect("menu")} className="w-6 h-6 mb-4 text-black">
        <MenuIcon />
      </button>
      <button onClick={() => onSelect("home")} className="w-6 h-6 mb-4 text-black">
        <HomeIcon />
      </button>
      <button onClick={() => onSelect("play")} className="w-6 h-6 mb-4 text-black">
        <PlayIcon />
      </button>
      <button onClick={() => onSelect("settings")} className="w-6 h-6 mb-4 text-black">
        <SettingsIcon />
      </button>
    </aside>
  );
};

export default Sidebar;