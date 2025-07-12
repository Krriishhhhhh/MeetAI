import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "./command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";


// This component is for searching meetings based on the agentId filter 


export const AgentIdFilter = () => {

    const [filters, setFilters] = useMeetingsFilters();

    // This is to find the agent in the filter using search bar
    const [agentSearch, setAgentSearch] = useState("");

    // We are fetching all the agents to difplay in the filter section
    const trpc = useTRPC();
    const { data } = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search: agentSearch
    }))

    return (
        <CommandSelect
            className="h-9"
            placeholder="Agent"
            options={(data?.items ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-4"
                        />
                        {agent.name}
                    </div>
                )
            }))}

            onSelect={(value) => setFilters({ agentId: value })}
            onSearch={setAgentSearch}
            value={filters.agentId ?? ""}
        />
    )
}