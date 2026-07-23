import GoogleProvider from "next-auth/providers/google"
import mongoDBConnection from "../mongodb/connection"
import User from "@/models/User"

export const authConfig = {
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account.provider === "google") {
                const { name, email } = user;
                try {
                    await mongoDBConnection();
                    const userExists = await User.findOne({ email });

                    if (!userExists) {
                        const newUser = await User.create({
                            name,
                            email,
                            provider: "google"
                        })

                        if (!newUser) {
                            return false;
                        }
                    }

                    return true;
                } catch (error) {
                    console.log(error);
                }
            }
            return user;
        },
    }
}