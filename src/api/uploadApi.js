import { API_BASE_URL } from "../utils/constants";

const BASE_URL = `${API_BASE_URL}/api/upload`;
//const BASE_URL = "https://localhost:7277/api/upload";

export async function uploadCompanyLogo(file, oldLogoUrl = "") {
    const formData = new FormData();
    formData.append("file", file);

    if (oldLogoUrl) {
        formData.append("oldLogoUrl", oldLogoUrl);
    }

    const response = await fetch(`${BASE_URL}/logo`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Error al subir el logo");
    }

    return response.json();
}