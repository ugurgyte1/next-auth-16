"use client"

import { useDialogStore } from "@/hooks/store/use-dialog-store"
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface OnCloseDialogWrapperProps {
    children: React.ReactNode
}

const OnCloseDialogWrapper = ({
    children
}:OnCloseDialogWrapperProps) => {

    const {onClose} = useDialogStore();

    const {update} = useSession();

    useEffect(() => {
        onClose();
        update()
    },[])

  return (
    <div>
        {children}
    </div>
  )
}

export default OnCloseDialogWrapper;