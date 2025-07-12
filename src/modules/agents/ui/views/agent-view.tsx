"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";


export const AgentsView = () => {

    const trpc = useTRPC(); //For trpc client creation

    // //data here will be fetched data from  agents table
    // const { data , isLoading , isError } = useQuery(trpc.agents.getMany.queryOptions())// agents here means we are calling agentsrouter , getmany procedure of the agentsrouter 

    const [filters, setFilters] = useAgentFilters(); //For keeping track of states in URL

    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters  //We are passing the current state of search and page in here to get the desired agents
    }))

    const router = useRouter();

    return (
        <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4s">

            {/* This loads the agent table */}
            <DataTable data={data.items}
                columns={columns}
                onRowCLick={(row) => router.push(`/agents/${row.id}`)}  //When we click on an agent , we go to that agents page
            />

            {/* This is for showcases pagination */}
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => { setFilters({ page }) }}
            />

            {/* If No agent then this will be loaded */}
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first Agent"
                    description="Create an agent to join your meetings . Each agent will follow your instructions and can interact with participants during the call "
                />
            )}
        </div>
    )
}