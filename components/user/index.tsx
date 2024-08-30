"use client";



import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SignOutButton } from "@clerk/nextjs";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";


import React, { useState, useEffect, useContext } from 'react';

interface Props {
  currentUser: User;
}

export default function ({ currentUser }: Props) {
  const router = useRouter();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={currentUser.avatar_url} alt={currentUser.nickname} />
          <AvatarFallback>{currentUser.nickname}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        <DropdownMenuLabel className="text-center truncate">
          {currentUser.nickname ? currentUser.nickname : currentUser.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator className="md:hidden" />

        <DropdownMenuCheckboxItem className="md:hidden">
          <a href="/pricing">Pricing</a>
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator className="md:hidden" />

        <DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>
            <SignOutButton signOutCallback={() => {
              // 清除 localStorage 中的用户信息
              localStorage.removeItem("user");
              // 刷新页面
              location.reload();
            }}>
              log out
            </SignOutButton>
          </DropdownMenuCheckboxItem>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
