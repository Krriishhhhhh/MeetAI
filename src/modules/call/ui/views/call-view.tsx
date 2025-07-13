"use client"

import { ErrorState } from "@/components/error-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CallProvider } from "../components/call-provider"


interface CallViewProps {
    meetingId: string
}



export const CallView = ({ meetingId }: CallViewProps) => {

    
    //Get the prefetched data of the particular meeting
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))


    if(data.status === "completed"){
        return(
            <div className="h-screen items-center justify-center">
                <ErrorState title="This Meeting is Ended" description="You can no longer join this meeting" />

            </div>
        )
    }



    return <CallProvider meetingId={meetingId} meetingName={data.name}/> 
}