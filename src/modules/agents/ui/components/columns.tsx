"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// We are using this type cause we wanna display Existing Agents in the Agent Table , thus AgentsGetOne[] is correct 
export const columns: ColumnDef<AgentGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Agent Name",  //Column 1 in Agent Table
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">

                {/* Agent Name and Aavatar */}
                <div className="flex items-center gap-x-2">
                    {/* Generating avatar in agent table  */}
                    <GeneratedAvatar
                        variant="botttsNeutral"
                        seed={row.original.name}
                        className="size-6"
                    />

                    <span className="font-semibold capitalize">{row.original.name}</span>
                </div>

                {/* Agent Instruction and an arror symbol */}
                <div className="flex items-center gap-x-2">
                    <CornerDownRightIcon className="size-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalise">
                        {row.original.instructions}
                    </span>
                </div>

            </div>
        )
    },
    {
        accessorKey: "meetingCount",
        header: "Meetings",//Column 2 in Agent Table
        cell: ({ row }) => (
            <div>
                <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                    <VideoIcon className="text-blue-700" />
                    {/* {row.original.meetingCount} {row.original.meetingCount === 1 ? "meeting" : " meetings"} */}
                    5 Meetings
                </Badge>
            </div>
        )

    },

]