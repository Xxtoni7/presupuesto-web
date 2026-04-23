const BASE_URL = "https://localhost:7277/api/presupuesto";

export async function getPresupuestos() {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Error al obtener los presupuestos");
    }

    return response.json();
}

export async function getPresupuestoById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Error al obtener el presupuesto");
    }

    return response.json();
}

export async function getPresupuestosByCompany(companyId) {
    const response = await fetch(`${BASE_URL}/company/${companyId}`);

    if (!response.ok) {
        throw new Error("Error al obtener los presupuestos de la empresa");
    }

    return response.json();
}

export async function searchPresupuestosByTitle(title) {
    const response = await fetch(
        `${BASE_URL}/search?title=${encodeURIComponent(title)}`
    );

    if (!response.ok) {
        throw new Error("Error al buscar presupuestos");
    }

    return response.json();
}

export async function createPresupuesto(presupuestoData) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(presupuestoData),
    });

    if (!response.ok) {
        throw new Error("Error al crear el presupuesto");
    }

    return response.json();
}

export async function updatePresupuesto(id, presupuestoData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(presupuestoData),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar el presupuesto");
    }

    return response.json();
}

export async function deletePresupuesto(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el presupuesto");
    }
}