import { useContext } from "react";
import { SearchContext } from "./searchStateContext";

export function useSearch() {
    return useContext(SearchContext);
}
