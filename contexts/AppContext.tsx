// @/path-to-your-context-file.tsx
import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { toast } from "sonner";

// 这里定义 userQuota 的类型
interface UserQuota {
  user_id: number;
  access_content_quota: number;
  run_ai_quota: number;
}

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [userQuota, setUserQuota] = useState<UserQuota | null>(null); // 添加 userQuota 状态
  const [lang, setLang] = useState<string>(() => {
    // 从本地存储读取语言设置，默认为 "en"
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || "en";
    }
    return "en";
  });

  // 获取用户信息
  const fetchUserInfo = async function () {
    try {
      const uri = "/api/get-user-info";
      const params = {};

      const resp = await fetch(uri, {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (resp.ok) {
        const res = await resp.json();
        console.log("fetch res: " + res.data.email)
        if (res.data) {
          setUser(res.data);
          return;
        }
      }
      setUser(null);
    } catch (e) {
      setUser(null);
      // toast.error("get user info failed");
    }
  };

  // 获取用户配额
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    // 将语言设置保存到本地存储
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  return (
    <AppContext.Provider value={{ user, fetchUserInfo, lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
};