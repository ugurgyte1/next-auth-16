"use client"

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import {signIn} from "next-auth/react";
import { useDialogStore } from "@/hooks/store/use-dialog-store";

const Social = () => {   

    const {callbackUrl} = useDialogStore();

    const onClick = (provider:"google" | "github" | undefined = undefined) => {    // burası eklendi     

        signIn(provider,{
            redirectTo: callbackUrl || "/settings"    // burası eklendi
        });

    }   

  return (
    <div className={`
        w-full flex flex-col gap-y-2
        card:flex-row gap-x-2
    `}>
        <Button
            className={`
                cursor-pointer
                card:w-1/2
            `}
            variant={"outline"}
            size={"lg"}
            onClick={() => onClick("google")}
        >
            <FcGoogle/>
        </Button>
        <Button
            className={`
                cursor-pointer
                card:w-1/2
            `}
            variant={"outline"}
            size={"lg"}
            onClick={() => onClick("github")}
        >
            <FaGithub/>
        </Button>
    </div>
  )
}

export default Social;