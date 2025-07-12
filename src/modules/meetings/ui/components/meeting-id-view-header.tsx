import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface MeetingIdViewHeaderProps {
    meetingId: string,
    meetingName: string;
    onEdit: () => void;
    onRemove: () => void
}

export const MeetingIdViewHeader = ({ meetingId, meetingName, onEdit, onRemove }: MeetingIdViewHeaderProps) => {
    return (
        <div className="flex items-center justify-between">

            {/* This is the My Meetings and Meeting Name Text */}
            <Breadcrumb>
                <BreadcrumbList>

                    {/* This is the My Meeting Text */}
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl">
                            <Link href={"/meetings"}>
                                My Meetings
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {/* This is the Right Arror Symbol */}
                    <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4 ">
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>

                    {/* This is the Name of the Meeting  */}
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
                            <Link href={`/meetings/${meetingId}`}>
                                {meetingName}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                </BreadcrumbList>
            </Breadcrumb>

            {/* This is the Drop Down Menu */}
            <DropdownMenu modal={false}>

                {/* This is the trigger of the dropdown menu , those 3 dots  */}
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>

                {/* This is what shows up when we click the trigger */}
                <DropdownMenuContent align="end">

                    {/* This is the Edit Icon , It is used to edit this agent */}
                    <DropdownMenuItem onClick={onEdit}>
                        <PencilIcon className="size-4 text-black" />
                        Edit
                    </DropdownMenuItem>

                    {/* This is the Delete Icon , It is used to Delete the agent */}
                    <DropdownMenuItem onClick={onRemove}>
                        <TrashIcon className="size-4 text-black" />
                        Delete
                    </DropdownMenuItem>


                </DropdownMenuContent>

            </DropdownMenu>

        </div>
    )
}