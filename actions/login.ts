"use server"

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerificationTokenEmail } from "@/lib/mails";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { loginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import zod from "zod";

export const login = async (values:zod.infer<typeof loginSchema>,callbackUrl:string | null) => {  // bura değişti

    const validatedFields = loginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid fields"};
    }

    const {email,password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email){
        return {error:"Email does not exist"};
    }

    if(!existingUser.emailVerified){

        const verificationToken = await generateVerificationToken(email);

        await sendVerificationTokenEmail(
            verificationToken.email,
            verificationToken.token
        )

        return {success:"Verification token email sent"};
    }

    if(existingUser.isTwoFactor){

        const twoFactorToken = await generateTwoFactorToken(existingUser.email);

        await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
        )

        return {twoFactor:true};
        
    }

    try {
        
        await signIn("credentials",{
            email: email,
            password: password,
            redirectTo: callbackUrl ?? "/settings"
        })

        return {success:""};

    } catch (error) {

        if(error instanceof AuthError){

            switch (error.name) {
                case "CredentialsSignin":
                    
                    return {error:"Invalid credentials"};
            
                default:
                    return {error:"Something went wrong"};
            }
        }

        throw error;
        
    }
    
}



