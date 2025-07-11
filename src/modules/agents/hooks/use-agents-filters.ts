import { DEFAULT_PAGE } from "@/constants"
import {parseAsInteger, parseAsString, useQueryStates} from "nuqs"

export const useAgentFilters = ()=>{
    return useQueryStates({
        search : parseAsString.withDefault("").withOptions({clearOnDefault:true}),
        page : parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
    })
}



/*
This code is setting up a custom hook called useAgentFilters that helps manage and sync URL query parameters (search and page) in the browser.

nuqs is a small library that helps manage URL query parameters as React state — so the values in the URL (?search=abc&page=2) are synced with  component’s state.


We're creating a hook to handle two filters:

search → For searching agent names

page → For pagination

And We're keeping these filters in the URL bar (like ?search=john&page=2), so:

Users can share the link as the link will be unique

When they refresh, the filter stays

The table updates based on URL

 */