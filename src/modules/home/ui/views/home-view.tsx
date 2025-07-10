"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";

export const HomeView = () => {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    if (!session) {
        return (
            <p>...Loading</p>
        )
    }
    return (
        <div>
            <p>
                Logged in as {session.user.name}


                {/*This is SignOUt button , When clicked , user will be signed out , his session will end and he will be redirected to sign-in page  */}
                <Button onClick={() => authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/sign-in"); // redirect to sign-in page
                        },
                    },
                })}>
                    Sign Out
                </Button>
            </p>
        </div>
    )
}

