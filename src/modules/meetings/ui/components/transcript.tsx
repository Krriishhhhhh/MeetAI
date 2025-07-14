import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface Props {
    meetingId: string
}

export const Transcript = ({ meetingId }: Props) => {

    // Get the Transcript
    const trpc = useTRPC();
    const { data } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }))

    const [searchQuery, setSearchQuery] = useState("")

    // Filter the data
    const filteredData = (data ?? []).filter((item) => item.text.toString().toLowerCase().includes(searchQuery.toLowerCase()))


    return (
        <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
            <p className="text-sm font-medium">Transcript</p>
            <div className="relative">
                <Input
                    placeholder="Search Transcript"
                    className="pl-7 h-9 w-[240px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>

            <ScrollArea>
                <div className="flex flex-col gap-y-4">
                    {/* Continue From here */}
                </div>
            </ScrollArea>
        </div>
    )
}