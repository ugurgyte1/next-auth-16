import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
import db from "./lib/db";
import { getUserById } from "./data/user";

declare module "next-auth" {

  interface Session {
    user: {
      
      role: "ADMIN" | "USER"
      isTwoFactor: boolean 
      image: string | null 
      isOAuth: boolean      // Burayı ekledik
 
    } & DefaultSession["user"]
  }
}

import { JWT } from "next-auth/jwt"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
 
declare module "next-auth/jwt" {
  
  interface JWT {
    
    role: "ADMIN" | "USER"    
    isTwoFactor: boolean
    image: string | null
    isOAuth: boolean      // Burayı ekledik

  }
}
 
export const { 
    auth, 
    handlers, 
    signIn, 
    signOut 
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    }, 
    events: {
        async linkAccount({user}){

            await db.user.update({
                where: {
                    id: user.id
                },
                data: {
                    emailVerified: new Date(new Date().getTime() + 3 * 3600 * 1000)
                }
            })
        }
    }, 
    callbacks: {
        // async signIn({user}){

        //     if(!user.id){
        //         return true; 
        //     }

        //     const existingUser = await getUserById(user.id);

        //     if(!existingUser){
        //         return true;
        //     }

        //     if(!existingUser.emailVerified){
        //         return false;
        //     }

        //     return true;
        // },
        async session({session,token}){

            if(session.user && token.sub){
                session.user.id = token.sub;
            }
            
            if(session.user && token.role){
                session.user.role = token.role;
            }

            if(session.user && token.isTwoFactor){
                session.user.isTwoFactor = token.isTwoFactor; // bura eklendi
            }

            if(session.user && token.name){
                session.user.name = token.name;
            }

            if(session.user && token.email){
                session.user.email = token.email;
            }

            if(session.user && token.image){
                session.user.image = token.image;
            }

            if(session.user && token.isOAuth){          // burayı ekledik
                session.user.isOAuth = token.isOAuth;
            }

            return session;
        },
        async jwt({token}){

            if(!token.sub){
                return token;
            }

            const existingUser = await getUserById(token.sub);

            if(!existingUser){
                return token;
            }   
            
            const existingAccount = await getAccountByUserId(existingUser.id);   // Burayı ekledik            

            token.role = existingUser.role;
            token.isTwoFactor = existingUser.isTwoFactor; // Burayı eklendi
            token.name = existingUser.name;
            token.email = existingUser.email;  
            token.image = existingUser.image; 
            token.isOAuth = !!existingAccount;     // Burayı ekledik                                

            return token;
        },
        async signIn({account,user}){

            if(!account){
                return true;
            }

            if(account.provider !== "credentials" ){
                return true; // Allow google and github provider
            }

            if(!user.id){
                return true;
            }

            const existingUser = await getUserById(user.id)

            if(!existingUser || !existingUser.password || !existingUser.email){
                return true;
            }

            if(!existingUser.emailVerified){
                return false; // don't allow if email is not verified
            }

            if(existingUser.isTwoFactor){

                const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if(!existingTwoFactorConfirmation){
                     return false;
                }

                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingTwoFactorConfirmation.id
                    }
                })

            }

            return true; 

        }
    },   
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt"
    },
    ...authConfig
})