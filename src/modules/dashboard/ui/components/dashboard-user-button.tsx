import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client"
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {

    const { data, isPending } = authClient.useSession()
    const router = useRouter();
    const isMobile = useIsMobile();//To check if we are on Mobile or not 


    //This is the function which uses betterauth to end the current session and redirect the user to signin page 
    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in"); // redirect to sign-in page
                },
            },
        })
    }


    //if there is no user , or data is being fetched , in that case dropdown trigger wont appear
    if (isPending || !data?.user) {
        return null;
    }

    if (isMobile) {
        return (
            <Drawer>


                {/* This is the Drawer Trigger , if we click it , a menu ill occur , this trigger has profile pic , name and email of user  */}
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image} />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar
                            seed={data.user.name}
                            variant="initials"
                            className="size-9 mr-3 "
                        />
                    )}

                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">
                            {data.user.name}
                        </p>
                        <p className="text-xs truncate w-full">
                            {data.user.email}
                        </p>
                    </div>

                    <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>

                {/* This is the acutal drawer content when drawer is open */}
                <DrawerContent>

                    {/* This is the Drawer Header , when menu opens up , it shows name and email */}
                    <DrawerHeader>
                        <DrawerTitle>{data.user.name}</DrawerTitle>
                        <DrawerDescription>{data.user.email}</DrawerDescription>
                    </DrawerHeader>


                    {/* This shows 2 buttons , Billing and Logout  */}
                    <DrawerFooter>
                        <Button
                            variant="outline"
                            onClick={() => { }}
                        >
                            <CreditCardIcon className="size-4 text-black" />
                            Billing

                        </Button>

                        <Button
                            variant="outline"
                            onClick={onLogout}
                        >
                            <LogOutIcon className="size-4 text-black" />
                            Logout

                        </Button>
                    </DrawerFooter>
                    
                </DrawerContent>

            </Drawer>
        )
    }

    return (
        <DropdownMenu>
            {/*This is the content of the trigger , what we see on the trigger itself , like pic , name and email*/}
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                {data.user.image ? (
                    <Avatar>
                        <AvatarImage src={data.user.image} />
                    </Avatar>
                ) : (
                    <GeneratedAvatar
                        seed={data.user.name}
                        variant="initials"
                        className="size-9 mr-3 "
                    />
                )}

                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {data.user.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {data.user.email}
                    </p>
                </div>

                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>

            {/*This is the content of the Menu , which comes when we click the trigger*/}
            <DropdownMenuContent align="end" side="right" className="w-72">

                {/*This is the label portion of the menu , containing name and email*/}
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1 ">
                        <span className="font-medium truncate">{data.user.name}</span>
                        <span className="text-xs font-normal text-muted-foreground truncate">{data.user.email}</span>
                    </div>
                </DropdownMenuLabel>

                {/*This is the seperator line*/}
                <DropdownMenuSeparator />

                {/*This is the main menu item  , Billing*/}
                <DropdownMenuItem
                    className="cursor-pointer flex items-center justify-between "
                >
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>

                {/*This is the main menu item , Logout */}
                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer flex items-center justify-between "
                >
                    Logout
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>


            </DropdownMenuContent>


        </DropdownMenu>
    )
}