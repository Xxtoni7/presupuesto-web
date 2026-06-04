import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { getCurrentUser, loginUser, logoutUser, refreshToken, registerUser } from "../api/authApi";
import { clearAccessToken } from "../utils/authTokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const hasRestoredSessionRef = useRef(false);

    const isAuthenticated = Boolean(user);

    const clearSession = useCallback(() => {
        clearAccessToken();
        setUser(null);
    }, []);

    const loadCurrentUser = useCallback(async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return currentUser;
    }, []);

    const restoreSession = useCallback(async () => {
        try {
            setIsLoadingAuth(true);

            await refreshToken();
            await loadCurrentUser();
        } catch {
            clearSession();
        } finally {
            setIsLoadingAuth(false);
        }
    }, [clearSession, loadCurrentUser]);

    useEffect(() => {
        if (hasRestoredSessionRef.current) return;

        hasRestoredSessionRef.current = true;
        restoreSession();
    }, [restoreSession]);

    useEffect(() => {
        const handleSessionExpired = () => {
            clearSession();
        };

        globalThis.addEventListener("auth:session-expired", handleSessionExpired);

        return () => {
            globalThis.removeEventListener("auth:session-expired", handleSessionExpired);
        };
    }, [clearSession]);

    const login = useCallback(
        async (email, password) => {
            await loginUser({ email, password });
            return loadCurrentUser();
        },
        [loadCurrentUser]
    );

    const register = useCallback(
        async ({ email, password, confirmPassword }) => {
            await registerUser({ email, password, confirmPassword });
            return loadCurrentUser();
        },
        [loadCurrentUser]
    );

    const logout = useCallback(async () => {
        await logoutUser();
        clearSession();
    }, [clearSession]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            isLoadingAuth,
            login,
            register,
            logout,
            restoreSession,
        }),
        [user, isAuthenticated, isLoadingAuth, login, register, logout, restoreSession]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return context;
}