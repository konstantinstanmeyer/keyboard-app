import GoogleProvider from "next-auth/providers/google"
import mongoDBConnection from "../mongodb/connection"

export const authConfig = {
    debug: false,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            
        }
    }
}