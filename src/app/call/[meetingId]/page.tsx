import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { auth } from "@/lib/auth"
import { CallView } from "@/modules/call/ui/views/call-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"



interface Props {
    params: Promise<{ meetingId: string }>
}


const Page = async ({ params }: Props) => {

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

    // Extracting MeetingID from url 
    const { meetingId } = await params


    // Prefetch the data of the desired meeting
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>


            <CallView meetingId={meetingId} />

        </HydrationBoundary>
    )
}

export default Page;