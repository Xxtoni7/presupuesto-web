import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem("isAuthenticated") === "true";
    });

    const login = async (email, password) => {
        if (email === "test@test.com" && password === "1234") {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            return true;
        }

        throw new Error("Credenciales inválidas");
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    const value = useMemo(() => {
        return { isAuthenticated, login, logout };
    }, [isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuth() {
    return useContext(AuthContext);
}