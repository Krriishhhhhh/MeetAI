"use client"

import { DataTable } from "@/components/data-table"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/empty-state"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { useRouter } from "next/navigation"
import { DataPagination } from "@/components/data-pagination"


export const MeetingsView = () => {

    // Fetching the prefetched meetings
    const trpc = useTRPC()

    const [filters, setFilters] = useMeetingsFilters();
    const router = useRouter();

    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters  //We are passing the current state of search ,status,agentId and  page in here to get the desired meetings
    }))



    return (

        <div className="flex-1 px-4 pb-4 md:px-8 flex flex-col gap-y-4">

            {/* This loads the complete meeting table */}
            <DataTable data={data.items} columns={columns} onRowCLick={(row) => router.push(`/meetings/${row.id}`)} />

            {/* This is for the Pagination of meetings */}
            <DataPagination page={filters.page} totalPages={data.totalPages} onPageChange={(page) => setFilters({ page })} />

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