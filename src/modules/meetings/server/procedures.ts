


import { db } from "@/db"
import { agents, meetings, user } from "@/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { z } from "zod"
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants"

import { TRPCError } from "@trpc/server"
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas"
import { MeetingStatus, StreamTranscriptMeeting } from "../types"
import { streamVideo } from "@/lib/stream-video"
import { generateAvatarUri } from "@/lib/avatar"
import JSONL from "jsonl-parse-stringify"



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
            search: z.string().nullish(),
            agentId: z.string().nullish(),
            status: z.enum([
                MeetingStatus.Upcoming,
                MeetingStatus.Active,
                MeetingStatus.Completed,
                MeetingStatus.Processing,
                MeetingStatus.Cancelled,
            ]).nullish()
        }))

        .query(async ({ ctx, input }) => {
            const { search, page, pageSize, status, agentId } = input //destructuring our input

            /*
            This query fetches a paginated list of meetings and agent detaila ssociated with the meeting as well as the duration created by the currently logged-in user. It includes the following logic:

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
                // We are selecting all the columns from meetings and agents table and duration which is calculated
                .select(
                    {
                        ...getTableColumns(meetings),
                        agent: agents,
                        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")

                    }

                )
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id), //To get only the meetings which the user created 
                        search ? ilike(meetings.name, `%${search}%`) : undefined, //This is like a search freature which user will use to find his meetings whe he types the meeting name

                        status ? eq(meetings.status, status) : undefined, //if status is defined , then filter meetings based on the desired status
                        agentId ? eq(meetings.agentId, agentId) : undefined, //if status is defined , then filter meetings based on the desired status
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize) //for pagination
                .offset((page - 1) * pageSize) //for pagination


            // This code gives you the total count of meetings created by the user where the meeting's name matches the search text (case-insensitively).
            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id), //To get only the meetings which the user created 
                        search ? ilike(meetings.name, `%${search}%`) : undefined, //This is like a search freature which user will use to find his agents 

                        status ? eq(meetings.status, status) : undefined, //if status is defined , then filter meetings based on the desired status
                        agentId ? eq(meetings.agentId, agentId) : undefined, //if status is defined , then filter meetings based on the desired status
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
                .select(
                    {
                        ...getTableColumns(meetings),
                        agent: agents,
                        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")

                    })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
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

            // We are creating the meeting
            const [createdMeeting] = await db
                .insert(meetings)
                .values(
                    {
                        ...input,
                        userId: ctx.auth.user.id  //When we are creating an meeting userid of meeting is set to be userid of user which created meeting
                    }
                )
                .returning()

            // Now we wiill initialise a call of type defualt and id of this call would be equivalent to meeting id which makes sense cause every meeting is a call. But this doesnt start the call , it just gives us an abject using which we will start the call 
            const call = streamVideo.video.call("default", createdMeeting.id);

            // We are creating the video call room on Stream’s backend, and attaching custom metadata to it (like who created it, the meeting ID, and name).
            await call.create({
                data: {

                    created_by_id: ctx.auth.user.id,

                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name
                    },

                    settings_override: {
                        transcription: {
                            language: "en",
                            mode: "auto-on",
                            closed_caption_mode: "auto-on"
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p"
                        }
                    }
                }
            })


            // After creating the call we need to make sure that our current agent with its latest details is in the Stream Server 

            // We are getting the agent which is associalted in this meeting 
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, createdMeeting.agentId))

            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent Not Found" })
            }

            // Inserting the agent in the server
            streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generateAvatarUri({ seed: existingAgent.name, variant: "botttsNeutral" })
                }
            ])

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
        }),


    // Procedure 5
    // This is used to remove the meeting , input is all the details 
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id), //Matching the input with the actual user id
                        eq(meetings.userId, ctx.auth.user.id) //Checking if this user made this meeting
                    )
                )
                .returning()

            if (!removedMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting Not Found" })
            }

            return removedMeeting
        }),

    //Procedure 6
    generateToken: protectedProcedure
        .mutation(async ({ ctx }) => {

            // We are inserting (or updating) logged-in users into the Stream Video platform, so that they can participate in video calls.
            // Before any user can join or host a video call using Stream Video, they must be registered on Stream's backend — with an ID, name, role, and optional image.
            await streamVideo.upsertUsers([
                {
                    id: ctx.auth.user.id,
                    name: ctx.auth.user.name,
                    role: "admin",
                    image: ctx.auth.user.image ?? generateAvatarUri({ seed: ctx.auth.user.name, variant: "initials" })

                }
            ])

            const expirationTime = Math.floor(Date.now() / 1000) + 3600 //1 hour
            const issuedAt = Math.floor(Date.now() / 1000) - 60

            // Now as the user exists in streamIO , we just need to generate its token 
            const token = streamVideo.generateUserToken({
                user_id: ctx.auth.user.id,
                exp: expirationTime,
                validity_in_seconds: issuedAt
            })

            return token;
        }),

        // Procedure 7 , will be used to get the transcript when meeting is completed
    getTranscript: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {

            // Get the meeting
            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting Not Found" })
            }

            //Get the transcript url 
            if (!existingMeeting.transcriptUrl) return [];
            const transcript = await fetch(existingMeeting.transcriptUrl)
                .then((res) => res.text())
                .then((text) => JSONL.parse<StreamTranscriptMeeting>(text))
                .catch(() => { return [] })

            // Get both agent and user speaker
            const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))]
            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds))
                .then((users) => users.map((user) => ({
                    ...user,
                    image: user.image ?? generateAvatarUri({ seed: user.name, variant: "initials" })
                })))
            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds))
                .then((agents) => agents.map((agent) => ({
                    ...agent,
                    image: user.image ?? generateAvatarUri({ seed: agent.name, variant: "botttsNeutral" })
                })))
            const speakers = [...agentSpeakers, ...userSpeakers]


            const transcriptWithSpeakers = transcript.map((item) => {

                const speaker = speakers.find((speaker) => speaker.id === item.speaker_id)

                if (!speaker) {
                    return {
                        ...item,
                        user: {
                            name: "Unknown",
                            image: generateAvatarUri({ seed: "Unknown", variant: "initials" })
                        }
                    }
                }

                return {
                    ...item,
                    user: {
                        name: speaker.name,
                        image: speaker.image
                    }
                }
            })

            return transcriptWithSpeakers
        })


})