import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;

}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    return (

        //This is the Whole card-like interface which pops up when we cick on the search button
        <CommandResponsiveDialog open={open} onOpenChange={setOpen} >
            <CommandInput
                placeholder="Find a meeting or agent"
            />

            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}