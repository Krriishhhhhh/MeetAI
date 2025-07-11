import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

// We are extracting the return type of the getOne procedure 
export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"]