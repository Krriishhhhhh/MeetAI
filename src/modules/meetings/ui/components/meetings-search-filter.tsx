import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

// This component is to implement a search bar to find an meeting based on the filters , it will be placed in agent list header 
export const MeetingSearchFilter = () => {

    const [filters, setFilters] = useMeetingsFilters();

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