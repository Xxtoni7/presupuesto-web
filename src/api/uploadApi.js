import { apiRequest } from "./apiClient";

const BASE_URL = "/api/upload";

export async function uploadCompanyLogo(file, oldLogoUrl = "") {
    const formData = new FormData();
    formData.append("file", file);

    if (oldLogoUrl) {
        formData.append("oldLogoUrl", oldLogoUrl);
    }

    return apiRequest(`${BASE_URL}/logo`, {
        method: "POST",
        body: formData,
    });
}