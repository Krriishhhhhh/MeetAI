"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"

import { useState } from "react"

import { NewMeetingDialogue } from "./new-meetings-dialogue"
import { MeetingSearchFilter } from "./meetings-search-filter"
import { StatusFilter } from "./status-filter"
import { AgentIdFilter } from "./agentId-filter"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const MeetingsListHeader = () => {

    const [filters, setFilters] = useMeetingsFilters();

    const isAnyFilterModified = !!filters.search || !!filters.status || !!filters.agentId //When search , status , agentid is empty this is false , thus clear button wont render , when seahc has something , this is true and clear button will render 

    // On clicking the clear button , we want the search , status , agentId and page to go to their default value 
    const onClearFilters = () => {
        setFilters({
            search: "",
            page: 1,
            agentId: "",
            status: null
        })
    }

    const [isDialogueOpen, setIsDialogueOpen] = useState(false)//To control when to open the dialogue

    return (
        <>
            {/* This is the Responsive Dialogue which opens when we click the button */}
            <NewMeetingDialogue open={isDialogueOpen} onOpenChange={setIsDialogueOpen} />

            {/* This renders the my meeting and new meeting button and meetingsearch bar */}
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">

                {/* This renders the my meetings and new meeting button */}
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Meetings</h5>
                    <Button onClick={() => { setIsDialogueOpen(true) }}>
                        <PlusIcon />
                        New Meetings
                    </Button>
                </div>

                {/* There are filters in here  */}
                <ScrollArea>
                    <div className="flex items-center gap-x-2 p-1">

                        {/* This renders the Meeting search Bar and we search the meetings by name  */}
                        <MeetingSearchFilter />

                        {/* This is the search filter to search meetings by status filter  */}
                        <StatusFilter />

                        {/* This is the search filter to search meeting by agents */}
                        <AgentIdFilter />

                        {/* Clear Button */}
                        {isAnyFilterModified && (
                            <Button value="outline" size="sm" onClick={onClearFilters}>
                                <XCircleIcon />
                                Clear
                            </Button>
                        )}

                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>


            </div>


        </>

    )
}