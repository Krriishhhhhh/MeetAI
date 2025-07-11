"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ResponsiveDialogueProps {
    title: string;
    description: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void
}


// THIS IS A CARD LIKE STRUCTURE WHICH WILL HAVE A TITLE AND A DESCRIPTION , AND CHILDREN BELOW THE HEADER
export const ResponsiveDialogue = ({ title, description, children, open, onOpenChange }: ResponsiveDialogueProps) => {

    const isMobile = useIsMobile(); //This boolean tells if we are on mobile or not 


    // We are gonna use a drawer on mobile 
    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>

                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {children}
                
            </DialogContent>
        </Dialog>
    )
}

