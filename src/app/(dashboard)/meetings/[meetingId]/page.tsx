import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { MeetingIdIdView } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";



interface Props {
    params: Promise<{ meetingId: string }>
}

const Page = async ({ params }: Props) => {

    const { meetingId } = await params; //Extracted meetingId from URL

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

    // Prefetch the data of the desired meeting
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Loading Meeting" description="This may take a while" />}>
                <ErrorBoundary fallback={<ErrorState title="Error loading meeting" description="Something went wrong" />}>

                    {/* This is the backbone or the starter of all UI on the meetingtPage */}
                    <MeetingIdIdView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;