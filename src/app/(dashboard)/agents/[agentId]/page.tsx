import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { AgentIdView } from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {
    params: Promise<{ agentId: string }>
}

const Page = async ({ params }: Props) => {

    //When user hits agents/123 , the page component is loaded , and this page component muust have a params prop where we are sending the agentId , and this agentId can be accessed by this Page component
    const { agentId } = await params;

    // Prefetch the data of the desired agent
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({ id: agentId }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Loading Agent" description="This may take a while" />}>
                <ErrorBoundary fallback={<ErrorState title="Error loading agent" description="Something went wrong" />}>

                    {/* This is the backbone or the starter of all UI on the agentPage */}
                    <AgentIdView agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;