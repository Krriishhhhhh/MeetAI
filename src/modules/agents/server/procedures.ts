import { db } from "@/db"
import { agents } from "@/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas"
import { z } from "zod"
import { and, count, desc, eq, ilike } from "drizzle-orm"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants"
import { CarTaxiFront } from "lucide-react"
import { TRPCError } from "@trpc/server"



//Porcedure is like a end point
//a router is like a think which holds similar proedure together 


//We have created agentsRouter whichmay have many procedure 
export const agentsRouter = createTRPCRouter({

    //Procedure 1
    //THis is for getting all the agents that the user created 
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))

        .query(async ({ ctx, input }) => {
            const { search, page, pageSize } = input //destructuring our input

            /*
            This query fetches a paginated list of agents created by the currently logged-in user. It includes the following logic:

            Filters:

            Only agents where userId matches the current user's ID (ctx.auth.user.id).

            If a search term is provided, it filters agents whose name contains the search text (ilike for case-insensitive partial match).

            Sorting:

            Agents are ordered by createdAt in descending order (newest first).

            If multiple agents have the same createdAt, they are further sorted by id in descending order.

            Pagination:

            Returns only a limited number of results per page using .limit(pageSize).

            Skips records from previous pages using .offset((page - 1) * pageSize).

            This ensures the user sees their own agents, optionally filtered by name, in reverse chronological order, with pagination applied.
            */
            const data = await db
                .select()
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id), //To get only the agents which the user created 
                        search ? ilike(agents.name, `%${search}%`) : undefined  //This is like a search freature which user will use to find his agents , he will know his agents name
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize) //for pagination
                .offset((page - 1) * pageSize) //for pagination


            // This code gives you the total count of agents created by the user where the agent's name matches the search text (case-insensitively).
            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id), //To get only the agents which the user created 
                        search ? ilike(agents.name, `%${search}%`) : undefined  //This is like a search freature which user will use to find his agents , he will know his agents name
                    )
                )

            const totalPages = Math.ceil(total.count / pageSize)


            return {
                items: data,
                total: total.count,
                totalPages
            };
        }),

    //Procedure 2
    //this is for getting the agent when its id is given
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))

        .query(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(
                    and(
                        eq(agents.id, input.id), //Matching inpud id with the actual agent id
                        eq(agents.userId, ctx.auth.user.id) //Linking Agents created by a user
                    )
                )

            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })
            }



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
                        userId: ctx.auth.user.id  //When we are creating an agent userid of agent is set to be userid of user which created agent
                    }
                )
                .returning()

            return createdAgent;
        }),

    //Procedure 4
    //To remove the agent when id is given 
    remove: protectedProcedure
        .input(z.object({ id: z.string() })) //Input is id of the agent which we want to delete
        .mutation(async ({ input, ctx }) => {
            const [removedAgent] = await db
                .delete(agents)
                .where(
                    and(
                        eq(agents.id, input.id), //Matching the input with the actual user id
                        eq(agents.userId, ctx.auth.user.id) //Checking if this user made this agent
                    )
                )
                .returning()

            if (!removedAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent Not Found" })
            }

            return removedAgent;
        }),

    // Procedure 5
    // This is used to update the agent , input is all the details 
    update: protectedProcedure
        .input(agentsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [updatedAgent] = await db
                .update(agents)
                .set(input) //This is what actually updates  , literally overrides the previous written values with the new one 
                .where(
                    and(
                        eq(agents.id, input.id), //Matching the input with the actual user id
                        eq(agents.userId, ctx.auth.user.id) //Checking if this user made this agent
                    )
                )
                .returning()

            if (!updatedAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent Not Found" })
            }

            return updatedAgent
        })

})