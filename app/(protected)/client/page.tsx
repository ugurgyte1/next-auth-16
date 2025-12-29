"use client"

import { useCurrentUser } from "@/hooks/use-current-user";
import UserInfo from "../_components/user-info";
import { useDialogStore } from "@/hooks/store/use-dialog-store";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const ClientPage = () => {

    const {onClose} = useDialogStore();      // Bura eklendi

    const {update} = useSession();

    const user = useCurrentUser();

    useEffect(() => {          // Bura eklendi
        onClose();             // Bura eklendi
        update();              // Bura eklendi
    },[])

    if(!user){
        return (
            <div className="p-3 rounded-lg bg-destructive/15 text-destructive">
                The User is not loaded!...
            </div>
        )
    }

  return (
    <UserInfo
        title="📱Client Component"
        user={user}
    />
  )
}

export default ClientPage; 