import { StreamTranscriptMeeting } from "@/modules/meetings/types";
import { inngest } from "./client";
import JSONL from "jsonl-parse-stringify"
import { agents, meetings, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit"


// In this file , we have inngest functions , these functions will trigger at a particular event and keep trying to do the task repeately on their own , reducing the load on the main app


// We are creating an agent here which will actually summarize the transcript
const summarizer = createAgent({
    name: "summarizer",
    system: `
    You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
    `.trim(),
    model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY })
})


// Purpose of this function is to summarize the meeting
export const meetingsProcessing = inngest.createFunction(
    { id: "meetings/processing" },
    { event: "meetings/processing" },
    async ({ event, step }) => {

        // We are fetching the transcript url of the meeting 
        const response = await step.run("fetch-transcript", async () => {
            return fetch(event.data.transcriptUrl).then((res) => res.text())
        })
        const transcript = await step.run("parse-transcript", async () => {
            return JSONL.parse<StreamTranscriptMeeting>(response)
        })

        

        // This enhances the transcript (which only has speaker IDs) by adding speaker names (or other details) from the database — both for users and AI agents.
        const transcriptWithSpeakers = await step.run("add-speakers", async () => {

            // This is just a fancy way of extracting all unique speaker Ids
            const speakerIds = [
                ...new Set(transcript.map((item) => item.speaker_id))
            ]

            //Speakers will be user as well as agents , so here we are extracting user and agent speakers seperatly
            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds))
                .then((users) => users.map((user) => ({ ...user })))

            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds))
                .then((agents) => agents.map((agent) => ({ ...agent })))

            // This contains all speakers , not just their ids , whole speakers
            const speakers = [...userSpeakers, ...agentSpeakers]

            // We are finally returning the transcript 
            return transcript.map((item) => {

                const speaker = speakers.find(
                    (speaker) => speaker.id === item.speaker_id
                )

                if (!speaker) {
                    return {
                        ...item,
                        user: {
                            name: "Unknown"
                        }
                    }
                }

            })


        })

        // This creates the summary
        const { output } = await summarizer.run(
            "Summarize the following transcript:" +
            JSON.stringify(transcriptWithSpeakers)
        )

        // Here we are putting the summary in database and makring the meeting as completed
        await step.run("save-summary", async () => {
            await db
                .update(meetings)
                .set({
                    summary: (output[0] as TextMessage).content as string,
                    status: "completed"
                })
                .where(eq(meetings.id, event.data.meetingId))
        })

    },
);