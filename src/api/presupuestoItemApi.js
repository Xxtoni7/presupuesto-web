import { apiRequest } from "./apiClient";

const BASE_URL = "/api/PresupuestoItem";

export async function getItemsByPresupuesto(presupuestoId) {
    return apiRequest(`${BASE_URL}/presupuesto/${presupuestoId}`);
}

export async function getItemById(id) {
    return apiRequest(`${BASE_URL}/${id}`);
}

export async function createPresupuestoItem(itemData) {
    return apiRequest(BASE_URL, {
        method: "POST",
        body: itemData,
    });
}

export async function updatePresupuestoItem(id, itemData) {
    return apiRequest(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: itemData,
    });
}

export async function deletePresupuestoItem(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
}