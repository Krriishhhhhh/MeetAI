import { db } from "@/db"
import { agents } from "@/db/schema"
import {  createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { agentsInsertSchema } from "../schemas"
import { z } from "zod"
import { eq } from "drizzle-orm"


//Porcedure is like a end point
//a router is like a think which holds similar proedure together 


//We have created agentsRouter whichmay have many procedure 
export const agentsRouter = createTRPCRouter({

    //Procedure 1
    //THis is for getting all the agents
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select()
            .from(agents)


        return data;
    }),

    //Procedure 2
    //this is for getting the agent when its id is given
    getOne: protectedProcedure
    .input(z.object({id : z.string()}))
    .query(async ({input}) => {
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id , input.id))


        return existingAgent;
    }),

    //Procedure 3
    // This Procedure is for inserting new agent in the database
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // const { name, instructions } = input; //This will come from the form inputs 
            // const { auth } = ctx //This is user data which we get when we check the session as this is a protected route

            const [createdAgent] = await db
                .insert(agents)
                .values(
                    {
                        ...input,
                        userId: ctx.auth.user.id
                    }
                )
                .returning()

            return createdAgent;
        })


})