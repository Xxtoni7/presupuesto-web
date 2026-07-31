let accessToken = null;
const HAS_SESSION_KEY = "auth:hasSession";

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token) {
    accessToken = token;
}

export function clearAccessToken() {
    accessToken = null;
}

export function setHasSession() {
    try {
        localStorage.setItem(HAS_SESSION_KEY, "true");
    } catch {
        // Storage can be unavailable in restricted browser modes.
    }
}

export function hasStoredSession() {
    try {
        return localStorage.getItem(HAS_SESSION_KEY) === "true";
    } catch {
        return false;
    }
}

export function clearHasSession() {
    try {
        localStorage.removeItem(HAS_SESSION_KEY);
    } catch {
        // Storage can be unavailable in restricted browser modes.
    }
}
