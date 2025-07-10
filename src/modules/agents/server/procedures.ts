import { db } from "@/db"
import { agents } from "@/db/schema"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"


//Porcedure is like a end point
//a router is like a think which holds similar proedure together 


//We have created agentsRouter whichmay have many procedure 
export const agentsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => { //Procedure 1
        const data = await db
            .select()
            .from(agents)


        return data;
    })
})