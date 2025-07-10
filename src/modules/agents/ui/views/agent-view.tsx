"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query";


export const AgentsView = () => {

    const trpc = useTRPC(); //For trpc client creation

    // //data here will be fetched data from  agents table
    // const { data , isLoading , isError } = useQuery(trpc.agents.getMany.queryOptions())// agents here means we are calling agentsrouter , getmany procedure of the agentsrouter 
    
    const { data} = useSuspenseQuery(trpc.agents.getMany.queryOptions())


    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}