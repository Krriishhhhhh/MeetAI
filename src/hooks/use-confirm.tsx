import { ResponsiveDialogue } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

//<-----------------------Complete Flow----------------------------------->
/* This hook return two things  , a ui component , and a function

initially when this hook is called , promise is null 
When the function is called , promise becomes not null 
If we cancel the action and use handleclose , promise resolves to be a false and then becomes null
If we confirm the action , then promise resolves to be true and then becomes null

That UI only popps up when the promise is not null
*/

export const useConfirm = (title: string, description: string): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void
    } | null>(null); //Promise is initially null


    // When this function is invoked , which is async ,then promise becomes not null and then the ui popps
    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve })
        })
    }

    // This is used to make the promise null after it resolves
    const handleClose = () => {
        setPromise(null)
    }

    // Used if the action is confirmed
    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    // Used if the action is canceled
    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    // This is the UI component Which we return
    const ConfirmationDialog = () => (

        <ResponsiveDialogue
            open={promise !== null}//This component only opens when promise is not null
            onOpenChange={handleClose}
            title={title}
            description={description}
        >
            <div className="p-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">

                {/* This is the cancel Button */}
                <Button
                    variant={"outline"}
                    className="w-full lg:w-auto"
                    onClick={handleCancel}>
                    Cancel
                </Button>

                {/* This is the confirm Button */}
                <Button
                    onClick={handleConfirm}
                    className="w-full lg:w-auto"
                >
                    Confirm
                </Button>
            </div>
        </ResponsiveDialogue>


    )

    return [ConfirmationDialog, confirm];
}