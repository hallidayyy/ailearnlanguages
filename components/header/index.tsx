import { AppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Nav } from "@/types/nav";
import User from "@/components/user";
import { useContext } from "react";
import { LangSwitcher } from "@/components/header/LangSwitcher";

export default function () {
  const { user, userQuota } = useContext(AppContext);

  const navigations: Nav[] = [
    { name: "pricing", title: "pricing", url: "/pricing", target: "_self" },
    {
      name: "blog",
      title: "blogs",
      url: "https://blog.languepod.fun/",
      target: "_blank",
    },
    // { name: "demo", title: "try for free", url: "/demo", target: "_self" },
  ];

  return (
    <header>
      <div className="h-auto w-screen">
        <nav className="font-inter mx-auto h-auto w-full max-w-[1600px] lg:relative lg:top-0">
          <div className="flex flex-row items-center px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-8 xl:px-20">
            <a href="/" className="text-xl font-medium flex items-center">
              <img
                src="/logo.png"
                className="w-8 h-8 rounded-full mr-2"
                alt="logo"
              />
              <span className="font-bold text-primary text-2xl">
                languepod
              </span>
            </a>

            <div className="hidden md:flex ml-16">
              {navigations.map((tab: Nav, idx: number) => (
                <a
                  className="text-md font-normal leading-6 text-gray-800 mx-4"
                  key={idx}
                  href={tab.url}
                  target={tab.target}
                >
                  {tab.title}
                </a>
              ))}
            </div>

            <div className="flex-1"></div>

            <div className="flex flex-row items-center lg:flex lg:flex-row lg:space-x-3 lg:space-y-0">
          

              {user === undefined ? (
                <>loading...</>
              ) : (
                <>
                  {user ? (
                    <>
                      {/* 显示 userQuota 的两个值 */}
                      {userQuota && (
                        <div className="hidden md:flex items-center mr-8">
                          <span className="text-gray-800 mr-4">
                            Access Content Quota: &nbsp;
                            <span className="text-primary">
                              {userQuota.access_content_quota}
                            </span>
                          </span>
                          <span className="text-gray-800">
                            Run AI Quota: &nbsp;
                            <span className="text-primary">
                              {userQuota.run_ai_quota}
                            </span>
                          </span>
                        </div>
                      )}

                      <User user={user} />
                    </>
                  ) : (
                    <a className="cursor-pointer" href="/sign-in">
                      <Button>Login</Button>
                    </a>
                  )}
                </>
              )}

              <a href="/dashboard" className="mr-4">
                <Button>dashboard</Button>
              </a>

              <LangSwitcher />
            </div>

            <a href="#" className="absolute right-5 lg:hidden"></a>
          </div>
        </nav>
      </div>
    </header>
  );
}