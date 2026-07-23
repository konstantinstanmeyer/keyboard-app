"use client"

import { signIn } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SignIn() {
    const pathname = usePathname();

    const providers = [
        { 
            id: "google", 
            name: "Google", 
            icon: "/icons/google.webp" 
        },
    ];

    const handleSignIn = async (providerId: string) => {
        try {
            const scrollY = window.scrollY;
            const hash = `#scroll-${scrollY}`;

            sessionStorage.setItem('scrollPosition', scrollY.toString());

            await signIn(providerId, { 
                callbackUrl: `${pathname}${hash}`
            });
        } catch (error) {
            console.error(`sign in failed with ${providerId}: `, error);
        }
    };

    return (
        <div className="">
            <div className="">
                {providers.map((provider) => (
                    <button
                        key={provider.id}
                        onClick={() => handleSignIn(provider.id)}
                        className="provider-button"
                    >
                        <Image 
                            alt={provider.name} 
                            width={40} 
                            height={40} 
                            src={provider.icon}
                            className="provider-icon"
                        />
                        <span className="provider-text">
                            Sign in with {provider.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}