import { getVerificationTokenByEmail } from "@/data/verification-token";
import db from "./db";
import { v4 as uuidv4 } from 'uuid';
import { getForgotPasswordTokenByEmail } from "@/data/forgot-password-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto";

export const generateVerificationToken = async (email:string) => {

    const existingVerificationToken = await getVerificationTokenByEmail(email);

    if(existingVerificationToken){
        await db.verificationToken.delete({
            where: {
                id: existingVerificationToken.id
            }
        })
    }

    const token = uuidv4();    

    const newVerificationToken = await db.verificationToken.create({
        data: {
            email: email,
            token: token,
            expires: new Date(new Date().getTime() + 4 * 3600 * 1000)
        }
    })

    return newVerificationToken;

}

export const generateForgotPasswordToken = async (email:string) => {

    const existingForgotPasswordToken = await getForgotPasswordTokenByEmail(email);

    if(existingForgotPasswordToken){
        await db.forgotPasswordToken.delete({
            where: {
                id: existingForgotPasswordToken.id
            }
        })
    }

    const token = uuidv4();    

    const newForgotPasswordToken = await db.forgotPasswordToken.create({
        data: {
            email: email,
            token: token,
            expires: new Date(new Date().getTime() + 4 * 3600 * 1000)
        }
    })

    return newForgotPasswordToken;

}

export const generateTwoFactorToken = async (email:string) => {

    const existingTwoFactorToken = await getTwoFactorTokenByEmail(email);

    if(existingTwoFactorToken){
        await db.twoFactorToken.delete({
            where: {
                id: existingTwoFactorToken.id
            }
        })
    }

    const token = crypto.randomInt(100_000,1_000_000).toString();   

    const newTwoFactorToken = await db.twoFactorToken.create({
        data: {
            email: email,
            token: token,
            expires: new Date(new Date().getTime() + 3.05 * 3600 * 1000)
        }
    })

    return newTwoFactorToken;

}