"use client"

import "@stream-io/video-react-sdk/dist/css/styles.css"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"
import { generateAvatarUri } from "@/lib/avatar";
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioOutputButton, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk"
import { LogInIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    onJoin: () => void
}

//  this DisabledVideoPreview component is rendering a video placeholder when a user has their camera off before or during a call. So basically a screen with name and avatar would be shown
const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: data?.user.name ?? "",
                    image: data?.user.image ?? generateAvatarUri({ seed: data?.user.name ?? "", variant: "initials" })
                } as StreamVideoParticipant
            }
        />
    )
}

// this will just pop a simple text asking the user to grant camera and mic permit 
const AllowBrowserPermissions = () => {
    return (
        <p className="text-sm">
            Please grant your browser permission to access your camera and microphone
        </p>
    )
}



export const CallLobby = ({ onJoin }: Props) => {

    const { useCameraState, useMicrophoneState } = useCallStateHooks(); //We are extracting two hooks to keep track of permission of using camera and microphone

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState(); //Asking for mic permission
    const { hasBrowserPermission: hasCameraPermission } = useCameraState(); //Asking for camera permission

    const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission; //This is only true is we have both camera and mic permission

    return (

        // This is the card UI which shows up in the lobby
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center items-center">
                        <h6 className="text-lg font-medium">Ready to Join?</h6>
                        <p className="text-sm">Set up your call before joining</p>

                        {/* This would be the actual video preview and its a built in feautre  */}
                        <VideoPreview
                            // If we have the permission and cam is off then do disabled video preview otherwise ask the user to give permit
                            DisabledVideoPreview={
                                hasBrowserMediaPermission
                                    ? DisabledVideoPreview
                                    : AllowBrowserPermissions
                            }
                        />


                        <div className="flex gap-x-2">
                            <ToggleAudioOutputButton />
                            <ToggleVideoPreviewButton />
                        </div>

                        <div className="flex gap-x-2 justify-between w-full">

                            <Button asChild variant={"ghost"}>
                                <Link href={"/meetings"}>
                                    Cancel
                                </Link>
                            </Button>


                            <Button onClick={onJoin}>
                                <LogInIcon />
                                Join Call
                            </Button>

                        </div>

                    </div>
                </div>

            </div>
        </div>


    )
}