import { apiRequest } from "./apiClient";

const BASE_URL = "/api/Plan";

export async function getCurrentPlan() {
    return apiRequest(`${BASE_URL}/current`);
}

export async function getAvailablePlans() {
    return apiRequest(`${BASE_URL}/available`);
}