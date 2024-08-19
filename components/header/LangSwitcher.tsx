// components/header/LangSwitcher.tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";

import { defaultLocale, localeNames } from "@/lib/i18n";
import { AppContext } from "@/contexts/AppContext"; // 替换为你的 AppContext 路径


export const LangSwitcher = () => {
  const router = useRouter();
  const { lang: contextLang, setLang } = useContext(AppContext);

  const [selectedLang, setSelectedLang] = useState(contextLang || defaultLocale);

  useEffect(() => {
    setSelectedLang(contextLang || defaultLocale);
  }, [contextLang]);

  const handleSwitchLanguage = (value: string) => {
    // 更新 AppContext 中的 lang 状态
    setLang(value);

    // 获取当前路径
    const currentPath = window.location.pathname;

    //更新 URL 中的语言参数
    if (value === defaultLocale) {
      router.push(currentPath.includes("?") ? currentPath.split("?")[0] : currentPath);
    } else {
      router.push(`${currentPath.split("?")[0]}?lang=${value}`);
    }
  };

  return (
    <Select value={selectedLang} onValueChange={handleSwitchLanguage}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(localeNames).map((key) => {
          const name = localeNames[key];
          return (
            <SelectItem className="cursor-pointer" key={key} value={key}>
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
    
  );
};