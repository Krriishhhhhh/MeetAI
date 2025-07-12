


"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { UpdateMeetingDialogue } from "../components/update-meetings-dialogue";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface MeetingIdViewProps {
    meetingId: string
}

export const MeetingIdIdView = ({ meetingId }: MeetingIdViewProps) => {


    //Get the prefetched data of the particular meeting
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))


    // <-----------------------------Below is the functionality to delete an agent------------------------>

    const router = useRouter();
    const queryClient = useQueryClient();//We are still using the prefetched data for loading client details , but for deletion and update purpose , we need to use cliet side trpc

    // Function to remove meeting
    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({

            // When we remove a meeting , data previously fetched from getMany is outdated , refetching need to be done
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))

                router.push("/meetings") //After deleting the meeting , we will go to the meetings page
            }
        })
    )

    const [RemoveConformation, conformRemove] = useConfirm(
        "Are You Sure?",
        `The following action will remove this meeting`
    )

    const handleRemoveMeeting = async () => {
        const ok = await conformRemove();

        if (!ok) return; //promise resolves to be false and then becomes null

        await removeMeeting.mutateAsync({ id: meetingId })
    }




    // <--------------------------------Beblow is Update Logic----------------------------------->
    const [updateMeetingDialogueOpen, setUpdateMeetingDialogueOpen] = useState(false)



    
    // These aare the possible meeting states
    const isUpcoming = data.status === "upcoming";
    const isCompleted = data.status === "completed";
    const isActive = data.status === "active";
    const isProcessing = data.status === "processing";
    const isCancelled = data.status === "cancelled";


    return (

        <>
            {/* This is the remove conformation */}
            <RemoveConformation />

            {/* This is the meeting update form */}
            <UpdateMeetingDialogue
                open={updateMeetingDialogueOpen}
                onOpenChange={setUpdateMeetingDialogueOpen}
                initialValues={data} />


            <div className="felx-1 px-4 py-4 md:px-8 flex flex-col gap-y-4 ">

                {/* This is the Header of A particular Meeting page */}
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => { setUpdateMeetingDialogueOpen(true) }}
                    onRemove={handleRemoveMeeting}
                />

                {/* We check which state the meeting is in and render the component accordingly */}

                {isCompleted && <div>Completed</div>}
                {isProcessing && <ProcessingState />}

                {isCancelled && <CancelledState />}

                {isActive && <ActiveState meetingId={meetingId} />}

                {isUpcoming && (<UpcomingState
                    meetingId={meetingId}
                    onCancelMeeting={() => { }}
                    isCancelling={false}
                />)}




            </div>

        </>
    )
}