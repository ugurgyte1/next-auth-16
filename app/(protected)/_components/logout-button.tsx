"use client"

import { useDialogStore } from "@/hooks/store/use-dialog-store";  
import { signOut } from "next-auth/react";     // bura eklendi

interface LogoutButtonProps {
    children: React.ReactNode
}

const LogoutButton = ({
    children
}:LogoutButtonProps) => {

    const {onClose} = useDialogStore();    // bura eklendi

    const onClick = () => {
        onClose();        // bura eklendi
        signOut();        // bura eklendi
    }

  return (
    <span onClick={onClick}>
        {children}
    </span>
  )
}

export default LogoutButton;