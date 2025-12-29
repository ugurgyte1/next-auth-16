import {create} from "zustand";

type DialogType = "login" | "register" | "two-factor" | null;

interface DialogStoreProps {
    isOpen: boolean;
    type: DialogType;
    callbackUrl?: string | null;
    onOpen: (type:DialogType,callbackUrl?:string) => void;
    onClose: () => void
}

export const useDialogStore = create<DialogStoreProps>(set => {
    return {
        isOpen: false,
        type: null,
        callbackUrl: null,
        onOpen: (type:DialogType,callbackUrl?:string) => {
            return set({
                isOpen: true,
                type,
                callbackUrl
            })
        },
        onClose: () => {
            return set({
                isOpen: false,
                type: null
            })
        }
    }
})