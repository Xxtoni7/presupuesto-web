import { apiRequest } from "./apiClient";

const BASE_URL = "/api/Presupuesto";

export async function getPresupuestos() {
    return apiRequest(BASE_URL);
}

export async function getPresupuestoById(id) {
    return apiRequest(`${BASE_URL}/${id}`);
}

export async function getPresupuestosByCompany(companyId) {
    return apiRequest(`${BASE_URL}/company/${companyId}`);
}

export async function searchPresupuestosByTitle(title) {
    return apiRequest(`${BASE_URL}/search?title=${encodeURIComponent(title)}`);
}

export async function createPresupuesto(presupuestoData) {
    return apiRequest(BASE_URL, {
        method: "POST",
        body: presupuestoData,
    });
}

export async function updatePresupuesto(id, presupuestoData) {
    return apiRequest(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: presupuestoData,
    });
}

export async function deletePresupuesto(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
}

export async function authorizePresupuestoPdfExport(id) {
    return apiRequest(`${BASE_URL}/${id}/export-pdf`, {
        method: "POST",
    });
}