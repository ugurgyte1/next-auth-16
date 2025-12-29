"use server"

import { currentRole } from "@/lib/auth/current-role";
import { UserRole } from "@prisma/client";

export const admin = async () => {

    const role = await currentRole();

    if(role !== UserRole.ADMIN){
        return {error:"You are not authorized to access this route"};
    }

    return {success:"You are authorized to access this route"};
    
}