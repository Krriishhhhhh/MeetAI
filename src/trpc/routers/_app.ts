
import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';

// We have imported our agentsroutes in the main app router , and this agent routermay contain as many procedure it wants 


export const appRouter = createTRPCRouter({
  agents: agentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;