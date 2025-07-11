import { ResponsiveDialogue } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";


interface NewAgentDialogueProps {
    open: boolean;
    onOpenChange: (open: boolean) => void
}


// This is the Responsive Dialogue specifically for creating New Agent 
export const NewAgentDialogue = ({ open, onOpenChange }: NewAgentDialogueProps) => {
    return (
        <ResponsiveDialogue
            title="New Agent"
            description="Create a new agent"
            open={open}
            onOpenChange={onOpenChange}
        >
           {/* Here We will have the New Agent Form */}
           <AgentForm 
        //    Once we submit the form or cancel it , we want it to close 
           onSuccess={()=> onOpenChange(false)}
           onCancel={()=> onOpenChange(false)}
           />
        </ResponsiveDialogue>
    )
}