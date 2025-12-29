"use client"

import { useDialogStore } from "@/hooks/store/use-dialog-store";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import TwoFactorForm from "./two-factor-form";

const AuthDialogComponent = () => {

    const {isOpen,type,onClose} = useDialogStore();

    const dialogChangeHandler = (isOpen:boolean) => {
        if(!isOpen){
            onClose();
        }
    }

    if(!type){
        return null;
    }

  return (
    <Dialog open={isOpen} onOpenChange={dialogChangeHandler}>
        <DialogTitle hidden={true}>Dialog</DialogTitle>
        <DialogContent className="w-100 p-2" aria-describedby={undefined}>
            {type === "login" && (<LoginForm/>)}
            {type === "register" && (<RegisterForm/>)}
            {type === "two-factor" && (<TwoFactorForm/>)}
        </DialogContent>
    </Dialog>
  )
}

export default AuthDialogComponent;