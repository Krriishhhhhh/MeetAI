import { z } from "zod";

// This is the Schema of inputs when we are gonna insert new agents 
export const agentsInsertSchema = z.object({
    name : z.string().min(1 , {message : "Name is required"}),
    instructions : z.string().min(1 , {message : "Instructions are required"}),
    
})