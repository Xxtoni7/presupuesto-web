import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { SearchContext } from "./searchStateContext";

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
