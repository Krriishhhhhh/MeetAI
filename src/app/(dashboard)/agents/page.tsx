import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { AgentsView } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// <------------------------COMPLETE FLOW------------------->
// When we reach agents page , first thing to be loading is this Page component , which will then prefetch the data , so when Agent View Client Component gets loaded , it will already have data , thus its overhead is reduced , and erorr and laodng state will be handled here through server component , in client we can be sure that we have data 

const Page = async () => {
    // We are fecthing the data in the server component , thus data will already be fetched and then we will render client componenet
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

    return (
        // Hydration boundary is something we do when we fetch the data in a server component
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense
                fallback={<LoadingState title="Loading Agents" description="This may take a while" />}
            >
                <ErrorBoundary fallback={<ErrorState title="Error loading Agents" description="Something Went Wrong" />}>
                    <AgentsView />
                </ErrorBoundary>

            </Suspense>

        </HydrationBoundary>
    )
}

export default Page;