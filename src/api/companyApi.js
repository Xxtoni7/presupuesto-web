import { apiRequest } from "./apiClient";

const BASE_URL = "/api/Company";

export async function getCompanies() {
    return apiRequest(BASE_URL);
}

export async function getCompanyById(id) {
    return apiRequest(`${BASE_URL}/${id}`);
}

export async function searchCompaniesByName(name) {
    return apiRequest(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
}

export async function createCompany(companyData) {
    return apiRequest(BASE_URL, {
        method: "POST",
        body: companyData,
    });
}

export async function updateCompany(id, companyData) {
    return apiRequest(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: companyData,
    });
}

export async function deleteCompany(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });
}