import { DEFAULT_PAGE } from "@/constants"
import {parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates} from "nuqs"
import { MeetingStatus } from "../types"


// All 4 are filters 
export const useMeetingsFilters = ()=>{
    return useQueryStates({
        search : parseAsString.withDefault("").withOptions({clearOnDefault:true}),
        page : parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
        status : parseAsStringEnum(Object.values(MeetingStatus)),
        agentId : parseAsString.withDefault("").withOptions({clearOnDefault:true}),
    })
}



/*
This code is setting up a custom hook called usemeetingsFilters that helps manage and sync URL query parameters (search and page) in the browser.

nuqs is a small library that helps manage URL query parameters as React state — so the values in the URL (?search=abc&page=2) are synced with  component’s state.


We're creating a hook to handle 4 filters:

search → For searching meeting names

page → For pagination

status → For searching meetings based on status

agentId → For searching metings based on the agents


And We're keeping these filters in the URL bar (like ?search=john&page=2), so:

Users can share the link as the link will be unique

When they refresh, the filter stays

The table updates based on URL

 */