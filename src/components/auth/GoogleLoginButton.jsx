import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { getGoogleClientId } from "../../config/googleAuth";
import { loadGoogleIdentityScript } from "../../utils/loadGoogleIdentityScript";

let isGoogleIdentityInitialized = false;
let activeCredentialHandler = null;

function GoogleLoginButton({ onSuccess, onError, disabled = false }) {
    const buttonContainerRef = useRef(null);
    const disabledRef = useRef(disabled);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        disabledRef.current = disabled;
    }, [disabled]);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        let isMounted = true;

        const handleCredentialResponse = (response) => {
            if (disabledRef.current) return;

            if (!response?.credential) {
                onErrorRef.current(
                    new Error("No se pudo obtener la credencial de Google.")
                );
                return;
            }

            onSuccessRef.current(response.credential);
        };

        activeCredentialHandler = handleCredentialResponse;

        const initializeGoogleButton = async () => {
            try {
                setIsReady(false);
                setHasError(false);

                await loadGoogleIdentityScript();

                if (!isMounted || !buttonContainerRef.current) return;

                const clientId = getGoogleClientId();

                if (!isGoogleIdentityInitialized) {
                    globalThis.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: (response) => {
                            activeCredentialHandler?.(response);
                        },
                    });

                    isGoogleIdentityInitialized = true;
                }

                buttonContainerRef.current.innerHTML = "";

                globalThis.google.accounts.id.renderButton(
                    buttonContainerRef.current,
                    {
                        type: "standard",
                        theme: "outline",
                        size: "large",
                        text: "continue_with",
                        shape: "rectangular",
                        logo_alignment: "left",
                        width: buttonContainerRef.current.offsetWidth || 360,
                    }
                );

                if (isMounted) {
                    setIsReady(true);
                }
            } catch (err) {
                if (!isMounted) return;

                setHasError(true);
                onErrorRef.current(
                    err instanceof Error
                        ? err
                        : new Error("No se pudo cargar Google Login.")
                );
            }
        };

        initializeGoogleButton();

        return () => {
            isMounted = false;

            if (activeCredentialHandler === handleCredentialResponse) {
                activeCredentialHandler = null;
            }
        };
    }, []);

    if (hasError) {
        return (
            <Button type="button" variant="outline" className="w-full" disabled>
                Google Login no disponible
            </Button>
        );
    }

    return (
        <div className="relative min-h-10 w-full">
            {!isReady && (
                <Button type="button" variant="outline" className="w-full" disabled>
                    Cargando Google...
                </Button>
            )}

            <div
                ref={buttonContainerRef}
                className={`w-full [&>div]:mx-auto ${
                    disabled ? "pointer-events-none opacity-60" : ""
                } ${isReady ? "" : "absolute inset-0 opacity-0"}`}
            />
        </div>
    );
}

GoogleLoginButton.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default GoogleLoginButton;