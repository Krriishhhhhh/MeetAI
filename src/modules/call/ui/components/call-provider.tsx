"use client"

import { authClient } from "@/lib/auth-client"
import { LoaderIcon } from "lucide-react";
import { CallConnect } from "./call-connect";
import { generateAvatarUri } from "@/lib/avatar";

interface CallProviderProps {
    meetingId: string,
    meetingName: string
}

// This component is just passing info of meeting and the user to callconnect
export const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {

    // We are getting the current session of the loggin in user 
    const { data, isPending } = authClient.useSession();

    // This will load if wehave no session or is session is pending
    if (!data || isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        )
    }

    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image ??
                generateAvatarUri({ seed: data.user.name, variant: "initials" })
            }
        />
    )

}