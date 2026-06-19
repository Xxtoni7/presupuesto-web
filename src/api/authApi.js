import { apiRequest } from "./apiClient";
import { setAccessToken, clearAccessToken } from "../utils/authTokenStore";

function saveAuthSession(data) {
    if (data?.accessToken) {
        setAccessToken(data.accessToken);
    }

    return data;
}

export async function registerUser({ email, password, confirmPassword }) {
    return apiRequest("/api/Auth/register", {
        method: "POST",
        body: {
            email,
            password,
            confirmPassword,
        },
        auth: false,
    });
}

export async function confirmEmail({ userId, token }) {
    const query = new URLSearchParams({
        userId,
        token,
    });

    return apiRequest(`/api/Auth/confirm-email?${query.toString()}`, {
        method: "GET",
        auth: false,
    });
}

export async function resendEmailConfirmation(email) {
    return apiRequest("/api/Auth/resend-email-confirmation", {
        method: "POST",
        body: {
            email,
        },
        auth: false,
    });
}

export async function loginUser({ email, password }) {
    const data = await apiRequest("/api/Auth/login", {
        method: "POST",
        body: {
            email,
            password,
        },
        auth: false,
    });

    return saveAuthSession(data);
}

export async function loginWithGoogle(idToken) {
    const data = await apiRequest("/api/Auth/google-login", {
        method: "POST",
        body: {
            idToken,
        },
        auth: false,
    });

    return saveAuthSession(data);
}

export async function refreshToken() {
    const data = await apiRequest("/api/Auth/refresh-token", {
        method: "POST",
        auth: false,
    });

    return saveAuthSession(data);
}

export async function getCurrentUser() {
    return apiRequest("/api/Auth/me");
}

export async function logoutUser() {
    try {
        await apiRequest("/api/Auth/logout", {
            method: "POST",
            auth: false,
        });
    } finally {
        clearAccessToken();
    }
}

export async function forgotPassword(email) {
    return apiRequest("/api/Auth/forgot-password", {
        method: "POST",
        body: {
            email,
        },
        auth: false,
    });
}

export async function resetPassword({ userId, token, newPassword, confirmNewPassword }) {
    return apiRequest("/api/Auth/reset-password", {
        method: "POST",
        body: {
            userId,
            token,
            newPassword,
            confirmNewPassword,
        },
        auth: false,
    });
}
