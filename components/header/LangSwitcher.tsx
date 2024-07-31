// components/header/LangSwitcher.tsx
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { defaultLocale, localeNames } from "@/lib/i18n";

export const LangSwitcher = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const lang = params.lang || langParam || defaultLocale;

  const [selectedLang, setSelectedLang] = useState(lang);
  const router = useRouter();

  useEffect(() => {
    setSelectedLang(lang);
  }, [lang]);

  const handleSwitchLanguage = (value: string) => {
    // 获取当前路径
    const currentPath = window.location.pathname;

    if (value === defaultLocale) {
      // 如果当前路径是主页，则重定向到主页
      if (currentPath === "/") {
        router.push("/");
      } else {
        // 否则，更新 URL 中的语言参数，但不重定向
        router.push(`${currentPath}`);
      }
    } else {
      // 如果当前路径是主页，则重定向到带有语言参数的主页
      if (currentPath === "/") {
        router.push(`/${value}`);
      } else {
        // 否则，更新 URL 中的语言参数，但不重定向
        router.push(`${currentPath}?lang=${value}`);
      }
    }
  };

  return (
    <Select value={selectedLang as string} onValueChange={handleSwitchLanguage}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(localeNames).map((key: string) => {
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