import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { MeetingsView } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


const Page = async () => {

    // Protecting the Route
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    )
    //If there is no session then we get redirect to sign in page
    if (!session) {
        redirect('/sign-in')
    }


    // Prefetching the meetings
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))

    return (

        <>

            {/* We are adding List Header here and not in meetings view cause everything this component loads is static info */}
            <MeetingsListHeader />

            {/*  Hydration boundary is something we do when we fetch the data in a server component*/}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<LoadingState title="Loading Meetings" description="This may take few seconds" />}>
                    <ErrorBoundary fallback={<ErrorState title="Error Loading Meetings" description="Something is Wrong" />}>
                        <MeetingsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>

    )
}

export default Page;