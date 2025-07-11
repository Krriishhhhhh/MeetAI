"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { NewAgentDialogue } from "./new-agent-dialogue"
import { useState } from "react"
import { useAgentFilters } from "../../hooks/use-agents-filters"
import { AgentSearchFilter } from "./agents-search-filter"
import { DEFAULT_PAGE } from "@/constants"


export const AgentsListHeader = () => {

    const [filters, setFilters] = useAgentFilters();//just like usestate but these are in url so we keep track of the state 

    const [isDialogueOpen, setIsDialogueOpen] = useState(false);


    const isAnyFilterModified = !!filters.search //When search is empty this is false , thus clear button wont render , when seahc has something , this is true and clear button will render 

    // On clicking the clear button , we want the search and page to go to their default value 
    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE
        })
    }

    return (
        <>
            {/* This is the Responsive Dialogue which opens when we click the button */}
            <NewAgentDialogue open={isDialogueOpen} onOpenChange={setIsDialogueOpen} />

            {/* This renders the my agent and new agent button and agentsearch bar */}
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">

                {/* This renders the my agent and new agent button */}
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button onClick={() => setIsDialogueOpen(true)}>
                        <PlusIcon />
                        New Agents
                    </Button>
                </div>
                
                {/* This renders the Agent search Bar  */}
                <div className="flex items-center gap-x-2 p-1">
                    <AgentSearchFilter />

                    {/* Clear Button */}
                    {isAnyFilterModified && (
                        <Button value="outline" size="sm" onClick={onClearFilters}>
                            <XCircleIcon />
                            Clear
                        </Button>
                    )}


                </div>

            </div>


        </>

    )
}