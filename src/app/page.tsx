import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


const Page = async () => {

  //Code to get session of the user from server side
const session = await auth.api.getSession(
  {
    headers : await headers(),
  }
)

//If there is no session then we get redirect to sign in page
if(!session){
  redirect('/sign-in')
}


//-------------------NOW , HOMEVIEW WILL ONLY RENDER IF THERE IS A SESSION , OTHERWISE REDIRECTION WILL TAKE PLACE , TOGETHER THIS IS CALLED PROTECTING NONAUTH ROUTES

  return <HomeView />
}

export default Page;