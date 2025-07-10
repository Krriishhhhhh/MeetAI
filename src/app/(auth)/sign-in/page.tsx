
import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {

    //Code to get session of the user from server side
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    )

    //If session already exists redirect to homepage 
    if (!!session) {
        redirect('/')
    }


    return <SignInView />
}

export default Page;

//http://localhost:3000/sign-in