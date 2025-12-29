"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";
import LogoutButton from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";

const UserButton = () => {

    const [isClient,setIsClient] = useState<boolean>(false);

    const user = useCurrentUser();

    useEffect(() => {

        const func = () => {
            setIsClient(true);
        }

        func();
        
    },[])

    if(!isClient){
        return null;
    }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
                <AvatarImage src={`${user?.image}`}/>
                <AvatarFallback className="bg-sky-500 text-white">
                    <FaUser/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="px-3">
            <LogoutButton>
                <DropdownMenuItem className="cursor-pointer w-40">
                    <ExitIcon/>
                    Logout
                </DropdownMenuItem>
            </LogoutButton>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton;