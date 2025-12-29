"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useDialogStore } from "@/hooks/store/use-dialog-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";

interface BackButtonProps {
    label:string
    href?: string      // href optional yapıldı
}

const BackButton = ({
    label,
    href
}:BackButtonProps) => {

    const router = useRouter();

    const {onOpen,onClose} = useDialogStore();   // eklendi

    const {setTwoFactorFalse} = useAuthStore();

    const onClick = () => {
        if(label === "Don't have an account"){        // eklendi

            onClose();

            setTimeout(() => {

                onOpen("register");

            },50)
            
        }

        if(label === "Already have an account"){    // eklendi 

            onClose();

            setTimeout(() => {

                onOpen("login");

            },50)
        }

        if(label === "Back to Sign In"){
            onClose();
            router.push("/");
        }

        if(label === "Back to Sign In "){    // Burası eklendi
            onClose();
            setTwoFactorFalse();
            router.push("/")
        }
    }

  return (
    <Button 
        className="mx-auto cursor-pointer"    // class'a cursor-pointer eklendi
        variant={"link"}
        size={"sm"} 
        onClick={onClick}      
    >
        {label}
    </Button>
  )
}

export default BackButton;