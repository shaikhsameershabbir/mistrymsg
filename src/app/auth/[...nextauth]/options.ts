import nextAuth, { NextAuthOptions } from "next-auth";
import UserModal from "@/modal/user.modal";
import CredentialProvider from 'next-auth/providers/credentials'
import dbConnect from "@/lib/dbConnect";
import { error } from "console";
import { env } from "process";
const bcrypt = require('bcryptjs');
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            id: "credentials",
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModal.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { password: credentials.identifier },
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email')
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account first ')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password ")
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id,
                    token._isVerified = user.isVerified
            }
        },
        async session({ session, user, token }) {
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NextAUTH_SECRET
}