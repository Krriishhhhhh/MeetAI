


import { db } from "@/db"
import { meetings } from "@/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { z } from "zod"
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants"

import { TRPCError } from "@trpc/server"
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas"



//Porcedure is like a end point
//a router is like a think which holds similar proedure together 


//We have created meetingsRouter whichmay have many procedure 
export const meetingsRouter = createTRPCRouter({

    //Procedure 1
    //THis is for getting all the meetings that the user created 
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))

        .query(async ({ ctx, input }) => {
            const { search, page, pageSize } = input //destructuring our input

            /*
            This query fetches a paginated list of meetings created by the currently logged-in user. It includes the following logic:

            Filters:

            Only meetings where userId matches the current user's ID (ctx.auth.user.id).

            If a search term is provided, it filters meetings whose name contains the search text (ilike for case-insensitive partial match).

            Sorting:

            Meetings are ordered by createdAt in descending order (newest first).

            If multiple meetings have the same createdAt, they are further sorted by id in descending order.

            Pagination:

            Returns only a limited number of results per page using .limit(pageSize).

            Skips records from previous pages using .offset((page - 1) * pageSize).

            This ensures the user sees their own meetings, optionally filtered by name, in reverse chronological order, with pagination applied.
            */
            const data = await db
                .select({ ...getTableColumns(meetings) })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id), //To get only the meetings which the user created 
                        search ? ilike(meetings.name, `%${search}%`) : undefined  //This is like a search freature which user will use to find his meetings whe he types the meeting name
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize) //for pagination
                .offset((page - 1) * pageSize) //for pagination


            // This code gives you the total count of meetings created by the user where the meeting's name matches the search text (case-insensitively).
            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id), //To get only the meetings which the user created 
                        search ? ilike(meetings.name, `%${search}%`) : undefined  //This is like a search freature which user will use to find his agents 
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
    //this is for getting the meeting when its id is given
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))

        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({ ...getTableColumns(meetings) })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id), //Matching inpud id with the actual meeting id
                        eq(meetings.userId, ctx.auth.user.id) //Linking Meetings created by a user
                    )
                )

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" })
            }



            return existingMeeting;
        }),


    //Procedure 3
    // This Procedure is for inserting new meeting in the database
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // const { name, instructions } = input; //This will come from the form inputs 
            // const { auth } = ctx //This is user data which we get when we check the session as this is a protected route

            const [createdMeeting] = await db
                .insert(meetings)
                .values(
                    {
                        ...input,
                        userId: ctx.auth.user.id  //When we are creating an meeting userid of meeting is set to be userid of user which created meeting
                    }
                )
                .returning()

            return createdMeeting;
        }),



    // Procedure 4
    // This is used to update the meeting , input is all the details 
    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input) //This is what actually updates  , literally overrides the previous written values with the new one 
                .where(
                    and(
                        eq(meetings.id, input.id), //Matching the input with the actual user id
                        eq(meetings.userId, ctx.auth.user.id) //Checking if this user made this meeting
                    )
                )
                .returning()

            if (!updatedMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting Not Found" })
            }

            return updatedMeeting
        })


})