// @/path-to-your-context-file.tsx
import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useEffect, useState } from "react";

import { Cover } from "@/types/cover";
import { User } from "@/types/user";
import { toast } from "sonner";

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [covers, setCovers] = useState<Cover[] | null>(null);
  const [lang, setLang] = useState<string>(() => {
    // 从本地存储读取语言设置，默认为 "en"
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || "en";
    }
    return "en";
  });

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
        console.log("fetch user info in appcontext: "+res.data.user_id);
        if (res.data) {
          setUser(res.data);
          return;
        }
      }

      setUser(null);
    } catch (e) {
      setUser(null);

      console.log("get user info failed: ", e);
      toast.error("get user info failed");
    }
  };

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
    <AppContext.Provider value={{ user, fetchUserInfo, covers, setCovers, lang, setLang }}>
      {children}
    </AppContext.Provider>
  );
};