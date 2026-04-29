import { useCallback, useEffect, useState } from "react";
import {getPresupuestos, deletePresupuesto, searchPresupuestosByTitle} from "../api/presupuestoApi";

export function usePresupuestos() {
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPresupuestos = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPresupuestos();
            setPresupuestos(data);
        } catch (err) {
            setError(err.message || "Error al obtener los presupuestos");
        } finally {
            setLoading(false);
        }
    }, []);

    const searchByTitle = async (title) => {
        try {
            setLoading(true);
            setError("");

            if (!title.trim()) {
                await fetchPresupuestos();
                return;
            }

            const data = await searchPresupuestosByTitle(title);
            setPresupuestos(data);
        } catch (err) {
            setError(err.message || "Error al buscar presupuestos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresupuestos();
    }, [fetchPresupuestos]);

    const removePresupuesto = async (id) => {
        try {
            await deletePresupuesto(id);
            await fetchPresupuestos();
        } catch (err) {
            throw new Error(err.message || "Error al eliminar el presupuesto");
        }
    };

    return {
        presupuestos,
        loading,
        error,
        fetchPresupuestos,
        searchByTitle,
        removePresupuesto,
    };
}