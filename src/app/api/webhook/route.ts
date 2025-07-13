import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { CallSessionStartedEvent, CallSessionParticipantLeftEvent } from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


// This file defines an API route  to receive and verify webhook events sent by Stream Video .Webhook would be a post request


// his uses the Stream SDK’s method to verify that the webhook wasn’t forged.It ensures the body of the request matches the signature.If the signature is wrong, it might be an attacker pretending to be Stream
function verifySignatureWithSDK(body: string, signature: string) {
    return streamVideo.verifyWebhook(body, signature)
}

// This is the main function that will be triggered when Stream sends a webhook to this route.
export async function POST(req: NextRequest) {

    // Stream includes a signature and API key in headers to prove the request is from them.We extract them for security validation.
    const signature = req.headers.get("x-signature")
    const apiKey = req.headers.get("x-api-key")
    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or Api key" },
            { status: 400 }
        )
    }

    const body = await req.text();

    //This is where verification happens
    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid Status" }, { status: 401 })
    }

    // Safely parse the JSON body of the request.
    let payload: unknown
    try {
        payload = JSON.parse(body) as Record<string, unknown>
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }


    // You're extracting the "type" property from the parsed payload.For example, if the webhook is for a "call.session_started" event, eventType will be "call.session_started".
    const eventType = (payload as Record<string, unknown>)?.type;



    if (eventType === "call.session_started") {

        // If the webhook event type is "call.session_started",You cast the payload to a specific CallSessionStartedEvent type.
        const event = payload as CallSessionStartedEvent

        // Extracting meeting ID 
        const meetingId = event.call.custom?.meetingId
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meeting Id" }, { status: 401 })
        }

        // We're checking if a meeting exists in the database by its ID, and also making sure that its status is not "completed", "active", or "cancelled"
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            )
        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting not found" }, { status: 404 })
        }

        // this code runs when a video call session starts (like after a webhook call.session_started is triggered):
        //✅ status: "active" — You’re marking the meeting as officially in progress
        // startedAt: new Date() — You log the exact timestamp when the meeting started
        //✅ .where(...) — You ensure that you’re only updating that specific meeting
        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id))

        // We now extract the associated agent woth this meeting
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId))
        if (!existingAgent) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 })
        }

        // Here we are starting to introduce a call and our main goal is to connect theagent to this call
        const call = streamVideo.video.call("default", meetingId)
        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id

        })
        realtimeClient.updateSession({
            instructions: existingAgent.instructions
        })

    } else if (eventType === "call.session_left") {

        // This condition checks whether the webhook payload is about someone leaving a call.

        // We're telling TypeScript to treat this payload as a CallSessionParticipantLeftEvent (a type probably provided by Stream's SDK). This gives you access to the right structure and fields.
        const event = payload as CallSessionParticipantLeftEvent

        //Getting the meetingId
        const meetingId = event.call_cid.split(":")[1]
        if (!meetingId) {
            return NextResponse.json({ error: "Missing MeetingId" }, { status: 400 })
        }

        // Ending the call when someone leave the call
        const call = streamVideo.video.call("default", meetingId)
        await call.end()
    }

    return NextResponse.json({ status: "ok" })
}