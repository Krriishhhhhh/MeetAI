import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { meetingsProcessing } from "@/inngest/functions";

export const runtime = "nodejs"; //this line is added by me to resolve an issue , might causea production break

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        meetingsProcessing
    ],
});