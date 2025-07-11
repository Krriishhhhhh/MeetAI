import { ResponsiveDialogue } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";


interface UpdateAgentDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues : AgentGetOne
}


// This is the Responsive Dialogue specifically for creating New Agent 
export const UpdateAgentDialogue = ({ open, onOpenChange , initialValues }: UpdateAgentDialogueProps) => {
    return (
        <ResponsiveDialogue
            title="Edit Agent"
            description="Edit the agent details"
            open={open}
            onOpenChange={onOpenChange}
        >
           {/* Here We will have the New Agent Form */}
           <AgentForm 
        //    Once we submit the form or cancel it , we want it to close 
           onSuccess={()=> onOpenChange(false)}
           onCancel={()=> onOpenChange(false)}
           initialValues={initialValues}
           />
        </ResponsiveDialogue>
    )
}