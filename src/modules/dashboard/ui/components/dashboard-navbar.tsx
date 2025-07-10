"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftClose, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {

    //This navbar is under sidebarprovider in layout.tsx , thus it can access anything sidebarprovider is providing , and sidebarprovider is giving us the state of the sidebar which we are accesing here 

    //STATE OF THE SIDEBAR
    const { state, toggleSidebar, isMobile } = useSidebar();

    //State of opening Command Interface 
    const [commandOpen, setCommandOpen] = useState(false);


    {/*This is keyboard ShortCut , ctrl+k */}
    useEffect(() => {
    const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setCommandOpen((open) => !open);
        }
    };

    document.addEventListener("keydown", down);

    return () => {
        document.removeEventListener("keydown", down);
    };
}, []);

    return (

        <>
            {/*Teling the Command Dialog to open */}
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} /> 

            {/*This is the entire NavBar */}
            <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">

                {/*This is the button on the top left of the navbar , which is used to close or open the sidebar  */}
                <Button className="size-9" variant="outline" onClick={toggleSidebar}>
                    {/*We are displaying different logos of react lucid based on the state of Sidebar  */}
                    {(state === "collapsed" || isMobile) ? <PanelLeftIcon className="size-4" /> : <PanelLeftClose className="size-4" />}

                </Button>

                {/*This is the Search Field Inside the Navbar  */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommandOpen((open)=> !open)}
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground " >

                    <SearchIcon />{/*Search Icon*/}
                    Search

                    {/*Little Keyboard element in the right end inside the search field */}
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">&#8984;</span>K
                    </kbd>

                </Button>

            </nav>

        </>

    )
} 