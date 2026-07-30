import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";
import { ThemeContext } from "./themeStateContext";

const THEME_STORAGE_KEY = "mt-presupuestos-theme";
const THEME_OPTIONS = new Set(["light", "dark", "system"]);
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme() {
    const storedTheme = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);

    return THEME_OPTIONS.has(storedTheme) ? storedTheme : "light";
}

function getSystemPrefersDark() {
    return globalThis.matchMedia?.(DARK_MEDIA_QUERY).matches ?? false;
}

export function ThemeProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [theme, setThemeState] = useState(getStoredTheme);
    const [systemPrefersDark, setSystemPrefersDark] = useState(
        getSystemPrefersDark
    );

    let resolvedTheme;

    if (theme === "system") {
        resolvedTheme = systemPrefersDark ? "dark" : "light";
    } else {
        resolvedTheme = theme;
    }

    const setTheme = useCallback((nextTheme) => {
        if (!THEME_OPTIONS.has(nextTheme)) return;

        globalThis.localStorage?.setItem(THEME_STORAGE_KEY, nextTheme);
        setThemeState(nextTheme);
    }, []);

    useEffect(() => {
        const mediaQuery = globalThis.matchMedia?.(DARK_MEDIA_QUERY);

        if (!mediaQuery) return undefined;

        const handleSystemThemeChange = (event) => {
            setSystemPrefersDark(event.matches);
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== THEME_STORAGE_KEY) return;

            setThemeState(
                THEME_OPTIONS.has(event.newValue)
                    ? event.newValue
                    : "light"
            );
        };

        globalThis.addEventListener("storage", handleStorageChange);

        return () => {
            globalThis.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const authenticatedTheme = isAuthenticated ? resolvedTheme : "light";
        const isDark = authenticatedTheme === "dark";

        root.classList.toggle("dark", isDark);
        root.dataset.appTheme = authenticatedTheme;
        root.style.colorScheme = authenticatedTheme;

        return () => {
            root.classList.remove("dark");
            delete root.dataset.appTheme;
            root.style.removeProperty("color-scheme");
        };
    }, [isAuthenticated, resolvedTheme]);

    const value = useMemo(
        () => ({
            theme,
            resolvedTheme,
            setTheme,
        }),
        [resolvedTheme, setTheme, theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
