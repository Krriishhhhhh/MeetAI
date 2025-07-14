import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

// We are extracting the return type of the getOne procedure , when getOne procedure is used , it returns this type of data 
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"]
export enum MeetingStatus {
    Upcoming = "upcoming",
    Active = "active",
    Completed = "completed",
    Processing = "processing",
    Cancelled = "cancelled",
}

// This is what the stream returns in its transcript url
export type StreamTranscriptMeeting = {
    speaker_id : string,
    type: string,
    text: string,
    start_ts: string,
    stop_ts: string,
}