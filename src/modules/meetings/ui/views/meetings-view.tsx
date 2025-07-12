"use client"

import { DataTable } from "@/components/data-table"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/empty-state"


export const MeetingsView = () => {

    // Fetching the prefetched meetings
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

    return (

        <div className="flex-1 px-4 pb-4 md:px-8 flex flex-col gap-y-4">

            {/* This loads the complete meeting table */}
            <DataTable data={data.items} columns={columns} />

            {/* If No Meeting then this will be loaded */}
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first meeting"
                    description="Schedule a meeting to connect with other. Each meeting lets you share ideas , collaborate and interact with participants in real time"
                />
            )}
        </div>
    )
}