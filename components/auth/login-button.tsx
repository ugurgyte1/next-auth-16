"use client"

import { useDialogStore } from "@/hooks/store/use-dialog-store";
import { useRouter} from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode
    mode?: string
    asChild?: boolean
}

const LoginButton = ({
    children,
    mode,
    asChild
}:LoginButtonProps) => {   

    const router = useRouter();  
    
    const {isOpen,type,onOpen} = useDialogStore();

    const onClick = () => {
        router.push("/auth/login");
    }

    const onDialogOpen = () => {
        if(!isOpen && !type){
            onOpen("login");
        }
    }

    if(mode === "modal"){
        return (      
            <span onClick={onDialogOpen}>
                {children}
            </span>
        )
    }

  return (
    <span onClick={onClick}>
        {children}
    </span>
  )
}

export default LoginButton;