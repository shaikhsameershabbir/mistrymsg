import nextAuth from "next-auth";
declare module 'next-auth' {
    interface User {
        _id?: string
        isVerified?: boolean,
        isAcceptingMassages?: boolean,
        username?: string
    }
}