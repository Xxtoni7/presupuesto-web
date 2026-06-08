import { API_BASE_URL } from "../utils/constants";
import { getAccessToken, setAccessToken, clearAccessToken } from "../utils/authTokenStore";

class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

let refreshPromise = null;

async function parseResponse(response) {
    const contentType = response.headers.get("content-type");

    if (response.status === 204) {
        return null;
    }

    if (contentType?.includes("application/json")) {
        return response.json();
    }

    return response.text();
}

function getApiErrorMessage(data, fallbackMessage) {
    if (!data) return fallbackMessage;

    if (typeof data === "string") {
        return data || fallbackMessage;
    }

    if (data.message) {
        return data.message;
    }

    if (data.errors) {
        const firstError = Object.values(data.errors)
            .flat()
            .find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    if (data.title) {
        return data.title;
    }

    return fallbackMessage;
}

async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_BASE_URL}/api/Auth/refresh-token`, {
            method: "POST",
            credentials: "include",
        })
            .then(async (response) => {
                const data = await parseResponse(response);

                if (!response.ok) {
                    clearAccessToken();
                    throw new ApiError(
                        getApiErrorMessage(data, "Sesión expirada. Iniciá sesión nuevamente."),
                        response.status,
                        data
                    );
                }

                setAccessToken(data.accessToken);
                return data.accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

export async function apiRequest(endpoint, options = {}) {
    const {
        method = "GET",
        body,
        headers = {},
        auth = true,
        retry = true,
    } = options;

    const token = getAccessToken();
    const isFormData = body instanceof FormData;

    const requestHeaders = {
        ...headers,
    };

    if (!isFormData && body !== undefined) {
        requestHeaders["Content-Type"] = "application/json";
    }

    if (auth && token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    let requestBody;

    if (isFormData) {
        requestBody = body;
    } else if (body !== undefined) {
        requestBody = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        credentials: "include",
        body: requestBody,
    });

    if (response.status === 401 && auth && retry) {
        try {
            await refreshAccessToken();

            return apiRequest(endpoint, {
                method,
                body,
                headers,
                auth,
                retry: false,
            });
        } catch (error) {
            clearAccessToken();

            globalThis.dispatchEvent(new Event("auth:session-expired"));

            throw error;
        }
    }

    const data = await parseResponse(response);

    if (!response.ok) {
        throw new ApiError(
            getApiErrorMessage(data, "Ocurrió un error al procesar la solicitud."),
            response.status,
            data
        );
    }

    return data;
}