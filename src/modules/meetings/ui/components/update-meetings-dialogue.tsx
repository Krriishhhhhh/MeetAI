import { ResponsiveDialogue } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";



interface UpdateMeetingDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
    initialValues: MeetingGetOne
}


// This is the Responsive Dialogue specifically for creating New Agent 
export const UpdateMeetingDialogue = ({ open, onOpenChange, initialValues }: UpdateMeetingDialogueProps) => {



    return (
        <ResponsiveDialogue
            title="Edit Meeting"
            description="Edit the meeting details"
            open={open}
            onOpenChange={onOpenChange}
        >
            {/* Here We will have the Update Meeting Form */}
            <MeetingForm
                onSuccess={() => { onOpenChange(false) }}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />

        </ResponsiveDialogue>
    )
}