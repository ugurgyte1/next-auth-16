"use client"

import { useCurrentRole } from "@/hooks/use-current-role";
import RoleGate from "../_components/role-gate";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";
import { useDialogStore } from "@/hooks/store/use-dialog-store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const AdminPage = () => {

  const {onClose} = useDialogStore();   // Bura eklendi

  const {update} = useSession();      // Bura eklendi

  const role = useCurrentRole();

  const onClickApiRoute = () => {

    fetch("/api/admin")
      .then((res) => {
          if(res.ok){
            toast.success("You are authorized to view this route");
          } else {
            toast.error("You are not authorized to view this route");
          }
      })
  }

  const onClickRouteRouter = () => {

    admin()
      .then((data) => {
          if(data.success){
            toast.success(data.success);
          }
          if(data.error){
            toast.error(data.error);
          }
      })
  }

  useEffect(() => {       // Bura eklendi
    onClose();
    update();
  },[])

  if(!role){
    return (
      <div>
        The role is not loaded!
      </div>
    )
  }

  return (
    <div className="bg-white w-[600px] p-4 rounded-lg flex flex-col items-center justify-center gap-y-2">
      <h1 className="font-semibold text-xl my-2">
        🔑Admin Page
      </h1>
      <div className="w-full">
      <RoleGate role={role}>          
         <FormSuccess message="You are authorized to view this route"/>                
      </RoleGate>
      </div>
      <div className="w-full flex items-center justify-between border-2 rounded-lg shadow2xl py-2 px-3">
        <p>Use api router</p>
        <Button className="cursor-pointer" onClick={onClickApiRoute}>
          Click to see what will happen
        </Button>
      </div>
      <div className="w-full flex items-center justify-between border-2 rounded-lg shadow-xl py-2 px-3">
        <p>Use route router</p>
        <Button className="cursor-pointer" onClick={onClickRouteRouter}>
          Click to see what will happen
        </Button>
      </div>
    </div>
  )
}

export default AdminPage;