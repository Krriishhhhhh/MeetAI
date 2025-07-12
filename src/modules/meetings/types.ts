import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

// We are extracting the return type of the getOne procedure , when getOne procedure is used , it returns this type of data 
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]