const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function getGoogleClientId() {
    if (!GOOGLE_CLIENT_ID) {
        throw new Error("Falta configurar VITE_GOOGLE_CLIENT_ID en el frontend.");
    }

    return GOOGLE_CLIENT_ID;
}