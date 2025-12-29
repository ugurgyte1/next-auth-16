"use server"

import { getForgotPasswordTokenByToken } from "@/data/forgot-password-token";
import { resetPasswordSchema } from "@/schemas";
import zod from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";

export const resetPassword = async (values:zod.infer<typeof resetPasswordSchema>,token:string) => {

    const validatedFields = resetPasswordSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid fields"};
    }

    const {password} = validatedFields.data;

    if(!token){
        return {error:"Missing token"};
    }

    const existingResetPasswordToken = await getForgotPasswordTokenByToken(token);

    if(!existingResetPasswordToken){
        return {error:"Token does not exist"};
    }

    const expiredToken = new Date(existingResetPasswordToken.expires) < new Date(new Date().getTime() + 3 * 3600 * 1000);

    if(expiredToken){
        return {error:"Token expired"};
    }

    const existingUser = await getUserByEmail(existingResetPasswordToken.email);

    if(!existingUser){
        return {error:"Email does not exist"};
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword,
            email: existingResetPasswordToken.email
        }
    })

    await db.forgotPasswordToken.delete({
        where: {
            id: existingResetPasswordToken.id
        }
    })

    return {success:"Password changed"};

}