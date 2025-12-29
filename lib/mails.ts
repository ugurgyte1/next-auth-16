import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationTokenEmail = async (email:string,token:string) => {

    const verifyingLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your Verification Token",
        html: `<p>Please click <a href="${verifyingLink}">link</a> to verify your account</p>`
    })
}

export const sendForgotPasswordTokenEmail = async (email:string,token:string) => {

    const verifyingLink = `${domain}/auth/reset-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your Reset Password Token",
        html: `<p>Please click <a href="${verifyingLink}">link</a> to reset your password</p>`
    })
}

export const sendTwoFactorTokenEmail = async (email:string,token:string) => {    

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your Two Factor Token",
        html: `<p>Your two factor token code:${token}</p>`
    })
}