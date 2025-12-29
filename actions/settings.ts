"use server"

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth/current-user";
import db from "@/lib/db";
import { settingsSchema } from "@/schemas";
import zod from "zod";
import bcrypt from "bcryptjs";

export const settings = async (values:zod.infer<typeof settingsSchema>) => {

    const user = await currentUser();

    if(!user || !user.id){
        return {error:"Unauthorized"};
    }

    const dbUser = await getUserById(user.id);   
    
    if(!dbUser){
        return {error:"Unauthorized"};
    }

    if(user.isOAuth){
        values.email = undefined;
        values.isTwoFactor = undefined;
        values.password = undefined;
        values.newPassword = undefined;
    }

    if(values.email && values.email !== user.email){             // Burası eklendi

        const existingUser = await getUserByEmail(values.email);

        if(existingUser){
            return {error:"Email already in use"};
        }

    }

    if(values.password && values.newPassword){        

        const matchedPassword = await bcrypt.compare(values.password,dbUser.password!);

        if(!matchedPassword){
            return {error:"Incorrect password"};
        }

        const hashedPassword = await bcrypt.hash(values.newPassword,10);

        const {newPassword,...other} = values;

        values = other;

        values.password = hashedPassword;

    }

    await db.user.update({
        where: {
            id: dbUser.id
        },
        data: {
            ...values
        }
    })

    return {success:"Settings updated"};
    
}