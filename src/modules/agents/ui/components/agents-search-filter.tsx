import { Input } from "@/components/ui/input";
import { useAgentFilters } from "../../hooks/use-agents-filters"
import { SearchIcon } from "lucide-react";

// This component is to implement a search nar to find an agent , it will be placed in agent list header 
export const AgentSearchFilter = () => {

    const [filters, setFilters] = useAgentFilters();

    return (
        <div className="relative">
            <Input
                placeholder="Filter by name"
                className="h-9 bg-white w-[200px] pl-7"
                value={filters.search} //Now this search will be in the URL as well as search field
                onChange={(e) => setFilters({ search: e.target.value })}
            />

            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        </div>
    )
}