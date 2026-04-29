const BASE_URL = "https://localhost:7277/api/presupuestoitem";

export async function getItemsByPresupuesto(presupuestoId) {
    const response = await fetch(`${BASE_URL}/presupuesto/${presupuestoId}`);

    if (!response.ok) {
        throw new Error("Error al obtener los ítems del presupuesto");
    }

    return response.json();
}

export async function getItemById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Error al obtener el ítem");
    }

    return response.json();
}

export async function createPresupuestoItem(itemData) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
    });

    if (!response.ok) {
        throw new Error("Error al crear el ítem");
    }

    return response.json();
}

export async function updatePresupuestoItem(id, itemData) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
    });

    if (!response.ok) {
        throw new Error("Error al editar el ítem");
    }

    return response.json();
}

export async function deletePresupuestoItem(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Error al eliminar el ítem");
    }
}