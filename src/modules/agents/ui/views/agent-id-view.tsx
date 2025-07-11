"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialogue } from "../components/update-agent-dialog";

interface AgentIdViewProps {
    agentId: string
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {


    //Get the prefetched data of the particular agent
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))


    // <-----------------------------Below is the functionality to delete an agent------------------------>

    const router = useRouter();
    const queryClient = useQueryClient();//We are still using the prefetched data for loading client details , but for deletion and update purpose , we need to use cliet side trpc

    // Function to remove agent
    const removerAgent = useMutation(
        trpc.agents.remove.mutationOptions({

            // When we remove an agent , data previously fetched from getMany is outdated , refetching need to be done
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))

                router.push("/agents") //After deleting the agent , we will go to the agents page
            },

            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const [RemoveConformation, conformRemove] = useConfirm(
        "Are You Sure?",
        `The following action will remove 5 associated meetings`
    )

    const handleRemoveAgent = async () => {
        const ok = await conformRemove();

        if (!ok) return; //promise resolves to be false and then becomes null

        await removerAgent.mutate({ id: agentId })
    }


    // <--------------------------------Beblow is Update Logic----------------------------------->

    const [updateAgentDialogueOpen, setUpdateAgentDialogueOpen] = useState(false)

    return (

        <>
            <RemoveConformation />

            <UpdateAgentDialogue
                open={updateAgentDialogueOpen}
                onOpenChange={setUpdateAgentDialogueOpen}
                initialValues={data} />


            <div className="felx-1 px-4 py-4 md:px-8 flex flex-col gap-y-4 ">

                {/* We first Load the Header on the Individual Agent Page  */}
                <AgentIdViewHeader
                    agentId={agentId}
                    agentName={data.name}
                    onEdit={() => setUpdateAgentDialogueOpen(true)}
                    onRemove={handleRemoveAgent}
                />

                {/* This is the UI which loads below the header and displays stuff about the agent */}
                <div className="bg-white rounded-lg border">
                    <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">

                        {/* This is the Avatar */}
                        <div className="flex items-center gap-x-3">
                            <GeneratedAvatar
                                variant="botttsNeutral"
                                seed={data.name}
                                className="size-10"
                            />

                            <h2 className="text-2xl font-medium">{data.name}</h2>
                        </div>

                        {/* This is the section which shows number of meetings */}
                        <Badge
                            variant={"outline"}
                            className="flex items-center gap-x-2 [&>svg]:size-4"
                        >
                            <VideoIcon className="text-blue-700" />
                            {/* {row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting" : " meetings"} */}
                            5 Meetings
                        </Badge>

                        {/* This is the section which shows Instructions */}
                        <div className="flex flex-col gap-y-4">
                            <p className="text-lg font-medium">Instructions</p>
                            <p className="text-neutral-800">{data.instructions}</p>
                        </div>

                    </div>

                </div>


            </div>

        </>
    )
}