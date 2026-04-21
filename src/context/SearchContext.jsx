import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState("");

    const value = useMemo(() => ({
        searchTerm,
        setSearchTerm
    }), [searchTerm]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

SearchProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useSearch() {
    return useContext(SearchContext);
}