const GOOGLE_IDENTITY_SCRIPT_ID = "google-identity-services-script";
const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleIdentityScriptPromise = null;

export function loadGoogleIdentityScript() {
    if (globalThis.google?.accounts?.id) {
        return Promise.resolve();
    }

    if (googleIdentityScriptPromise) {
        return googleIdentityScriptPromise;
    }

    googleIdentityScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.getElementById(GOOGLE_IDENTITY_SCRIPT_ID);

        if (existingScript) {
            existingScript.addEventListener("load", resolve, { once: true });
            existingScript.addEventListener("error", reject, { once: true });
            return;
        }

        const script = document.createElement("script");

        script.id = GOOGLE_IDENTITY_SCRIPT_ID;
        script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => {
            googleIdentityScriptPromise = null;
            reject(new Error("No se pudo cargar Google Login."));
        };

        document.body.appendChild(script);
    });

    return googleIdentityScriptPromise;
}