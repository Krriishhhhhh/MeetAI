"use client"

import { useTRPC } from "@/trpc/client";
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CallUI } from "./call-ui";


import "@stream-io/video-react-sdk/dist/css/styles.css"



interface Props {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}


// This component is the one which created a client and call and connect them , we have a seperate component for the UI
export const CallConnect = ({
    meetingId,
    meetingName,
    userId,
    userName,
    userImage,
}: Props) => {

    // Generating a stream Token for the user 
    const trpc = useTRPC();
    const { mutateAsync: generateToken } = useMutation(trpc.meetings.generateToken.mutationOptions());

    // <------------------------Establishing StreamVideo  Client ---------------------->

    // You're creating a client state variable to store the StreamVideoClient instance.
    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const _client = new StreamVideoClient({

            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!, //The apiKey is your public key from Stream (used to identify your app).

            user: {  //This defines the current logged-in user for the video call.
                id: userId,
                name: userName,
                image: userImage,
            },

            tokenProvider: generateToken, //To get the token for this user 
        });

        //You're storing the created client in React state so that it can be used later (for example: to create or join a call).
        setClient(_client);

        // This runs automatically when the component is unmounted (i.e. when it disappears from the screen or is no longer needed).
        return () => {
            _client.disconnectUser();
            setClient(undefined)
        }
    }, [userId, userName, userImage, generateToken]);


    // <------------------------Establishing Call ---------------------->
    const [call, setCall] = useState<Call>();

    useEffect(() => {

        // If we dont have the client we can't start a call 
        if (!client) return;

        // Created a call , we have a client as well as the meeting id 
        const _call = client.call("default", meetingId);

        _call.camera.disable() //By defualt camera is off
        _call.microphone.disable() // BY default microphone is off

        setCall(_call)

        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {  // “Has the user already left the call?”
                _call.leave(); //If the user hasn’t left yet, then we need to leave and end the call manually
                _call.endCall();
                setCall(undefined)
            }
        }

    }, [client, meetingId])


    //At this point we should have a client and a call
    if (!client || !call) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white" />
            </div>
        )
    }


    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUI meetingName={meetingName} />
            </StreamCall>
        </StreamVideo>
    )
}