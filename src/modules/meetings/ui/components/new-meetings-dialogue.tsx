import { ResponsiveDialogue } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";



interface NewMeetingDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
}


// This is the Responsive Dialogue specifically for creating New Agent 
export const NewMeetingDialogue = ({ open, onOpenChange }: NewMeetingDialogueProps) => {

    const router = useRouter();

    return (
        <ResponsiveDialogue
            title="New Meeting"
            description="Create a new meeting"
            open={open}
            onOpenChange={onOpenChange}
        >
            {/* Here We will have the New Meeting Form */}
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false)
                    router.push(`/meetings/${id}`)
                }}
                onCancel = {()=> onOpenChange(false)}
            />

        </ResponsiveDialogue>
    )
}