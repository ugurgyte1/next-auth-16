import {create} from "zustand";

interface AuthState {
    email: string;
    password: string;
    showTwoFactor: boolean;     // Burası eklendi    
    setShowTwoFactor: () => void;   // Burası eklendi  
    setTwoFactorFalse: () => void;   // En son bu fonksiyon eklendi 
    setLoginData: (email:string,password:string) => void;
    clearLoginData: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    email: "",
    password: "",
    showTwoFactor: false,
    setShowTwoFactor: () => {
        return set({
            showTwoFactor: true
        })
    },
    setTwoFactorFalse: () => {
        return set({
            showTwoFactor: false
        })
    },
    setLoginData: (email,password) => set({email,password}),
    clearLoginData: () => set({email:"",password:""})
}));