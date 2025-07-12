"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CircleCheck, CircleXIcon, ClockArrowUpIcon, ClockFadingIcon, CornerDownRightIcon, LoaderIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import humanizeDuration from "humanize-duration"
import { format } from "date-fns"
import { cn } from "@/lib/utils"



function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        round: true,
        units: ["h", "m", "s"]
    })
}


// This is the icon we use based on the status
const statusIconMap = {
    upcoming: ClockArrowUpIcon,
    active: LoaderIcon,
    completed: CircleCheck,
    processing: LoaderIcon,
    cancelled: CircleXIcon

}

// This is the styles we use based on the status 
const statusColorMap = {
    upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5"

}

// We are using this type cause we wanna display Existing Agents in the Agent Table , thus AgentsGetOne[] is correct 
export const columns: ColumnDef<MeetingGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",  //Column 1 in Meeting Table
        cell: ({ row }) => (
            <div className="flex flex-col gap-y-1">

                {/* This is the Name of the Meeting */}
                <span className="font-seminbold capitalize">{row.original.name}</span>

                {/* This has agent name , avatar and meeting starting time */}
                <div className="flex items-center gap-x-2">

                    {/* This renders the agent name associated with the meeting and a icon */}
                    <div className="flex items-center gap-x-1">
                        <CornerDownRightIcon className="size-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalise">
                            {row.original.agent.name}
                        </span>
                    </div>

                    {/* This is the agent avatar */}
                    <GeneratedAvatar
                        seed={row.original.agent.name}
                        variant="botttsNeutral"
                        className="size-4"
                    />
                    {/* This displays the meeting starting time  */}
                    <span className="text-sm text-muted-foreground">
                        {row.original.startedAt ? format(row.original.startedAt, "MMM D") : ""}
                    </span>

                </div>

            </div>
        )
    },


    {
        accessorKey: "status",
        header: "Status",//Column 2 in Meeting Table
        cell: ({ row }) => {

            // Choosing the Icon based on the status
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap]

            return (

                // We are rendering status and status icon
                <Badge
                    variant={"outline"}
                    className={cn(
                        "capitalize [&>svg]:size-4 text-muted-foreground",
                        statusColorMap[row.original.status as keyof typeof statusColorMap] //Extracting some CSS based on status 
                    )}
                >
                    {/* This is the Icon which we extracted above */}
                    <Icon
                        className={cn(
                            row.original.status === "processing" && "animate-spin"
                        )}
                    />
                    {row.original.status}
                </Badge>
            )
        }

    },

    {
        accessorKey: "duration",  //Column 3 of meeting table , which displays the duration
        header: "duration",
        cell: ({ row }) => (
            <Badge
                variant={"outline"}
                className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
            >
                <ClockFadingIcon className="text-blue-700" />
                {row.original.duration ? formatDuration(row.original.duration) : " No duration"}

            </Badge>
        )
    }

]