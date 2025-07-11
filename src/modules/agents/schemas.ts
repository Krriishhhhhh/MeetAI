import { z } from "zod";

// This is the Schema of inputs when we are gonna insert new agents 
export const agentsInsertSchema = z.object({
    name : z.string().min(1 , {message : "Name is required"}),
    instructions : z.string().min(1 , {message : "Instructions are required"}),
    
})

// This is the schema of inputs when we are gonna update the agent
export const agentsUpdateSchema = agentsInsertSchema.extend({
    id : z.string().min(1 , {message : " Id is required"})
})