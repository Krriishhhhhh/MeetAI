import { EmptyState } from "@/components/empty-state"



export const ProcessingState = () => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">

            {/* This is the Processing state UI card , we have using empty state component but changed the image */}
            <EmptyState
                image="/processing.svg"
                title="Meeting Cancelled"
                description="This meeting was cancelled"
            />

        </div>
    )
}