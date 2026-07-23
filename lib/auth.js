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
            if (account.provider === "google") {
                const { name, email } = user;
                try {
                    await mongoDBConnection();
                    const userExists = await User.findOne({ email });

                    if (!userExists) {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/user`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name,
                                email,
                                provider: "google"
                            }),
                        });

                        if (res.ok) {
                            return user;
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            return user;
        },
    }
}