import { UserRole } from "@prisma/client";
import zod from "zod";

export const loginSchema = zod.object({
    email: zod.email({
        error: "Please provide a valid email"
    }),
    password: zod.string().min(6,{
        error: "Please provide a password at least 6 characters"
    })
})

export const registerSchema = zod.object({
    name: zod.string().min(1,{
        error: "Please provide a name at least 1 characters"
    }),
    email: zod.email({
        error: "Please provide a valid email"
    }),
    password: zod.string().min(6,{
        error: "Please provide a password at least 6 characters"
    })
})

export const forgotPasswordSchema = zod.object({
    email: zod.email({
        error: "Please provide a valid email"
    })
})

export const resetPasswordSchema = zod.object({    
    password: zod.string().min(6,{
        error: "Please provide a password at least 6 characters"
    })
})

export const twoFactorSchema = zod.object({    
    code: zod.string().min(6,{
        error: "Please provide a code at least 6 characters"
    })
})

export const settingsSchema = zod.object({
    name: zod.string().min(1,{
        error: "Please provide a name at least of 1 character"
    }).optional(),
    email: zod.email({
        error: "Please provide a valid email"
    }).optional(),
    password: zod.string().transform(val => val === "" ? undefined : val).optional().pipe(zod.string().min(6,{
        error: "Please provide a password at least 6 characters"
    }).optional()), 
    newPassword: zod.string().transform(val => (val === "" ? undefined : val)).optional().pipe(zod.string().min(6,{
        error: "Please provide a new password at least 6 characters"
    }).optional()),
    role: zod.enum([UserRole.ADMIN,UserRole.USER]).optional(),
    isTwoFactor: zod.boolean().optional()
}).refine((data) => {

    if(data.password && !data.newPassword){
        return false;
    }

    return true;

},{
    error: "newPassword required",
    path: ["newPassword"]
}).refine((data) => {

    if(!data.password && data.newPassword){
        return false;
    }

    return true;

},{
    error: "Password required",
    path: ["password"]
})