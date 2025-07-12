import { z } from "zod";

// This is the Schema of inputs when we are gonna insert new meetings 
export const meetingsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    agentId: z.string().min(1, { message: "Agent is required" }),

})

// This is the schema of inputs when we are gonna update the meeting
export const meetingsUpdateSchema = meetingsInsertSchema.extend({
    id: z.string().min(1, { message: " Id is required" })
})