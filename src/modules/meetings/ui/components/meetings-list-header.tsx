"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

import { useState } from "react"

import { NewMeetingDialogue } from "./new-meetings-dialogue"

export const MeetingsListHeader = () => {

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

                {/* This renders the Meeting search Bar  */}
                <div className="flex items-center gap-x-2 p-1">


                    {/* Clear Button */}



                </div>

            </div>


        </>

    )
}