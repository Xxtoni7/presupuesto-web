let accessToken = null;

export function getAccessToken() {
    return accessToken;
}

export function setAccessToken(token) {
    accessToken = token;
}

export function clearAccessToken() {
    accessToken = null;
}