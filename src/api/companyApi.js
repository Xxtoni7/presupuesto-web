const BASE_URL = "https://localhost:7277/api/company";

export async function getCompanies() {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Error al obtener empresas");
    }

    return response.json();
}

export async function getCompanyById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Error al obtener la empresa");
    }

    return response.json();
}

export async function searchCompaniesByName(name) {
    const response = await fetch(
        `${BASE_URL}/search?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
        throw new Error("Error al buscar empresas");
    }

    return response.json();
}

export async function createCompany(companyData) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
    });

    if (!response.ok) {
        throw new Error("Error al crear la empresa");
    }

    return response.json();
}

export async function updateCompany(id, companyData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
    });

    if (!response.ok) {
        throw new Error("Error al editar la empresa");
    }

    return response.json();
}

export async function deleteCompany(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la empresa");
    }
}