"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterSuccess() {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    console.log("someone calls me!!!");
    if (typeof window !== "undefined" && !isRegistered) {
      // 确保代码在客户端执行且尚未注册
      const registerUser = async () => {
        try {
          const response = await fetch('/api/register-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('User registered successfully:', data);
            setIsRegistered(true);  // 设置注册标志
            router.push('/dashboard');  // 使用 Next.js 路由器进行跳转
          } else {
            const errorData = await response.json();
            console.error('Failed to register user:', errorData);
            // 可以在这里添加更多的错误处理逻辑，例如显示错误消息给用户
          }
        } catch (error) {
          console.error('Error during user registration:', error);
          // 处理网络错误或其他异常
        }
      };

      registerUser();
    }
  }, [router, isRegistered]);

  return <div>正在处理您的注册信息...</div>;
}