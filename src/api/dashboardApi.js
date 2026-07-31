import { apiRequest } from "./apiClient";

const BASE_URL = "/api/Dashboard";

export async function getDashboardSummary() {
    return apiRequest(`${BASE_URL}/summary`);
}