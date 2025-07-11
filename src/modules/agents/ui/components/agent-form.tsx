import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;


}




export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {

    const trpc = useTRPC();

    const queryClient = useQueryClient();


    // Function to create new Agent 
    const createAgent = useMutation(
        trpc.agents.create.mutationOptions(
            {
                // This data might be outdated — please re-fetch it next time it’s needed.This is what happening here 
                onSuccess: async () => {
                    await queryClient.invalidateQueries(
                        trpc.agents.getMany.queryOptions({})
                    )

                    // After Succesfully editing the agent , its data might be outdated and needs to be refetched 
                    if (initialValues?.id) {
                        await queryClient.invalidateQueries(
                            trpc.agents.getOne.queryOptions({ id: initialValues.id })
                        )
                    }

                    onSuccess?.()
                },

                onError: (error) => {
                    toast.error(error.message)
                },
            }
        )
    )

    // This is the form 
    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "", //If initial values of agent exist , we displat them
            instructions: initialValues?.instructions ?? "",
        }
    });

    // This form is used to edit an exisiting agent and also create a new agent / So we need to deteemine which scenario is this
    // isEdit-->false ? we are creating a new agent not editing
    const isEdit = !!initialValues?.id
    const isPending = createAgent.isPending

    // when we submit , if we are editing then editing will happen , but it will have its own logic , and ifwe are creating a agent then that will happen , which has its own logic
    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("TODO updateAgent")
        } else {
            createAgent.mutate(values)
        }
    }

    return (
        <Form {...form}>

            {/* This is the Complete Form */}
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

                {/* This is the avatar to be generated */}
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />

                {/* This is the Name Field */}
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Cyndia" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* This is the Instruction Field */}
                <FormField name="instructions" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="You are an AI who has feelings " />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* These are cancel and Create/Edit Buttons */}
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>

            </form>
        </Form>
    )
}