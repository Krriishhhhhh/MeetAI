import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CommandSelect } from "./command-select";
import { useState } from "react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialogue } from "@/modules/agents/ui/components/new-agent-dialogue";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;


}




export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();


    const [agentSearch, setAgentSearch] = useState("")//To keep track of whats written in the search bar when user is asked to select and agent while creatig or editing a meeting
    const [openNewAgentDialogue, setOpenNewAgentDialogue] = useState(false);//T

    //To get the agents create dby the user and the ones whose name matches the input in the search field
    // This call will be made each time input in the dialogue search field changes
    const agents = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search: agentSearch
    }))


    // Function to create new meeting 
    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions(
            {
                // This data might be outdated — please re-fetch it next time it’s needed.This is what happening here 
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getMany.queryOptions({})
                    )


                    onSuccess?.(data.id)
                },

                onError: (error) => {
                    toast.error(error.message)
                },
            }
        )
    )

    // Function to update meeting
    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions(
            {
                // This data might be outdated — please re-fetch it next time it’s needed.This is what happening here 
                onSuccess: async () => {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getMany.queryOptions({})
                    )

                    // After Succesfully editing the agent , its data might be outdated and needs to be refetched 
                    if (initialValues?.id) {
                        await queryClient.invalidateQueries(
                            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
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
    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "", //If initial values of meeting exist , we displat them
            agentId: initialValues?.agentId ?? "",
        }
    });

    // This form is used to edit an exisiting meeting and also create a new meeting / So we need to deteemine which scenario is this
    // isEdit-->false ? we are creating a new meeting not editing
    const isEdit = !!initialValues?.id
    const isPending = createMeeting.isPending || updateMeeting.isPending

    // when we submit , if we are editing then editing will happen , but it will have its own logic , and ifwe are creating a agent then that will happen , which has its own logic
    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({ ...values, id: initialValues.id })
        } else {
            createMeeting.mutate(values)
        }
    }

    return (
        <>

            <NewAgentDialogue open={openNewAgentDialogue} onOpenChange={setOpenNewAgentDialogue} />

            <Form {...form}>

                {/* This is the Complete Form */}
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>


                    {/* This is the Name Field */}
                    <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="English Practice" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />


                    {/* This is the Field to Select an Agent or open the dialogue to create a new agent  */}
                    <FormField name="agentId" control={form.control} render={({ field }) => (
                        <FormItem>

                            <FormLabel>Agent</FormLabel>

                            {/* Button to open dialogie to select an agent */}
                            <FormControl>

                                <CommandSelect
                                    //passing on the fetched agents (their id and name) or an empty array , and rendering the avatar and their name     
                                    options={(agents.data?.items ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar
                                                    seed={agent.name}
                                                    variant="botttsNeutral"
                                                    className="border size-6"
                                                />
                                                <span>{agent.name}</span>
                                            </div>
                                        ),
                                    }))}

                                    onSelect={field.onChange}
                                    onSearch={setAgentSearch}
                                    value={field.value}
                                    placeholder="Select an Agent"

                                />

                            </FormControl>

                            {/* In case we dont have an agent , we can open the dialoguue for creating the new agent */}
                            <FormDescription>
                                Not found what you&apos;re looking for?{" "}
                                <button
                                    type="button"
                                    className="text-promary hover:underline"
                                    onClick={() => setOpenNewAgentDialogue(true)}
                                >
                                    Create new agent
                                </button>

                            </FormDescription>

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
        </>

    )
}