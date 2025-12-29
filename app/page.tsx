"use client"

import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className={`min-h-screen flex flex-col items-center justify-center gap-y-6 bg-radial from-blue-400 to-blue-800
    text-center w-full max-w-full overflow-hidden
    `}>
      <h1 className={cn(
        "text-[10px] text-white font-semibold drop-shadow-2xl",
        "xxxs:text-4xl",
        "xxs:text-5xl",
        "xs:text-6xl",
        font.className
        )}>
        🔐Auth
      </h1>
      <p className={`
        text-[7px] text-white
        xxxs:text-sm
        xxs:text-[18px]
        xs:text-[20px]        
        `}>
        Simple authentication service
      </p>
      <LoginButton mode="modal">
          <Button
            className={`
              cursor-pointer w-10 h-6 text-[10px]
              xxxs:w-15 xxxs:h-10 xxxs:text-[12px]
              xxs:w-20 xxs:h-11 xxs:text-[14px]
              xs:w-22 xs:h-12 xs:text-[15px]
              `}
            variant={"secondary"}
            size={"sm"}
          >
            Sign In
          </Button>
      </LoginButton>
    </main>
  );
}
