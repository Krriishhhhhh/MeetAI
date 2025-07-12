import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandInput, CommandResponsiveDialog, CommandList, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";



interface Props {
    //These are list of items to show when the command dialogues open , we will be showing the agents name and their avatar based on who is the user and what he typed in the search field
    options: Array<{
        id: string,
        value: string,
        children: React.ReactNode
    }>;

    onSelect: (value: string) => void; //Func which will run when we select an agent 
    onSearch?: (value: string) => void;// Func which will run when we tye something in search field 
    value: string;//Current agent / option which is selected 
    placeholder?: string; //Text is nothi g is selected , by default we will set it "Select an OPtion"
    isSearchable?: boolean; // To enable/disable search bar
    className?: string
}

export const CommandSelect = ({
    options, onSelect, onSearch, value, placeholder = "Select an option", isSearchable, className
}: Props) => {

    const [open, setOpen] = useState(false); //State to close and open the dialogue

    // We will loop over through all the agents/options and find out which is the current option/agent selected . It might be the case that no value is selected so far
    const selectedOption = options.find((option) => option.value === value)

    return (
        <>

            {/* This is what we see when Dialogue is not open */}
            <Button
                onClick={() => setOpen(true)}
                type="button"
                variant={"outline"}
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className
                )}>

                <div>
                    {/* Button will recder the following : children(avatar and name of agent ) of the selectedOption or we can say the agent we have selecte d, but if there is no agent selected so far , we will display placeholder */}
                    {selectedOption?.children ?? placeholder}
                </div>

                <ChevronsUpDownIcon />

            </Button>

            {/* This is what we see when the dialogue is open */}
            <CommandResponsiveDialog
            shouldFilter={!onSearch}
                open={open}
                onOpenChange={setOpen}
            >

                {/* This is the search bar */}
                <CommandInput placeholder="Search..." onValueChange={onSearch} />

                {/* This is the list of options or agents which will be rendered when dialogue gets open */}
                <CommandList>

                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">No options found</span>
                    </CommandEmpty>

                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.value)
                                setOpen(false)
                            }}
                        >
                            {/* Rendering the avatar + agentname */}
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>

            </CommandResponsiveDialog>
        </>
    )
}