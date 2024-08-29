"use client"; 

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useEffect, useState } from "react";
import { User } from "@/types/user";

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [lang, setLang] = useState<string>('en');

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 检查 localStorage 中的用户信息
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      } else {
        fetchUserInfo(); // 仅在没有缓存用户信息时调用
      }

      // 设置语言信息
      const savedLang = localStorage.getItem("lang") || "en";
      setLang(savedLang);
    }
  }, []); // 只在组件挂载时运行一次

  const fetchUserInfo = async () => {
    console.log("call fetchUserInfo");
    try {
      const resp = await fetch("/api/get-user-info", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (resp.ok) {
        const res = await resp.json();
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          return;
        }
      }
      setUser(null);
      localStorage.removeItem("user");
    } catch (e) {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  return (
    <AppContext.Provider value={{ user, setUser, lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
};