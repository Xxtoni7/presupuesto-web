export const SESSION_RESTORE_FAILED_MESSAGE =
    "No pudimos mantener tu sesión activa. Revisá que tu navegador permita cookies para este sitio.";

const SESSION_MESSAGE_KEY = "auth:sessionMessage";

export function setSessionRestoreFailedMessage() {
    try {
        sessionStorage.setItem(SESSION_MESSAGE_KEY, SESSION_RESTORE_FAILED_MESSAGE);
    } catch {
        // Storage can be unavailable in restricted browser modes.
    }
}

export function consumeSessionMessage() {
    try {
        const message = sessionStorage.getItem(SESSION_MESSAGE_KEY);
        sessionStorage.removeItem(SESSION_MESSAGE_KEY);
        return message || "";
    } catch {
        return "";
    }
}

export function clearSessionMessage() {
    try {
        sessionStorage.removeItem(SESSION_MESSAGE_KEY);
    } catch {
        // Storage can be unavailable in restricted browser modes.
    }
}
