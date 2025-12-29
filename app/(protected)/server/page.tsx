"use server"

import { currentUser } from "@/lib/auth/current-user";
import UserInfo from "../_components/user-info";
import OnCloseDialogWrapper from "../_components/on-close-dialog-wrapper";

const ServerPage = async () => {

    const user = await currentUser();

    if(!user){
        return (
            <div className="p-3 rounded-lg bg-destructive/15 text-destructive">
                The User is not loaded!...
            </div>
        )
    }

  return (
    <OnCloseDialogWrapper>
        <UserInfo
            title="💻Server Component"
            user={user}
        />
    </OnCloseDialogWrapper>
  )
}

export default ServerPage; 