import { StreamTheme, useCall } from "@stream-io/video-react-sdk"
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnd } from "./call-end";

interface Props {
    meetingName: string
}

export const CallUI = ({ meetingName }: Props) => {

    const call = useCall(); //We can access the info of current call and this also has the means to join or leave the 



    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby")


    // This will run when we will join the call
    const handleJoin = async () => {
        if (!call) return;

        await call.join();

        setShow("call")
    }

    // This will run when we will end the call
    const handleLeave = async () => {
        if (!call) return

        call.endCall();
        setShow("ended")
    }

    return (
        <StreamTheme className="h-full">

            {/* By defualt we will be in the lobby , when we join the call we will be in call when we end the call , we want to see the end call ui */}
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
            {show === "ended" && <CallEnd/>}

        </StreamTheme>
    )
}