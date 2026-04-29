import { useCallback, useEffect, useState } from "react";
import { getPresupuestosByCompany, deletePresupuesto, searchPresupuestosByTitle} from "../api/presupuestoApi";


export function useCompanyPresupuestos(companyId) {
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCompanyPresupuestos = useCallback(async () => {
        if (!companyId) return;

        try {
            setLoading(true);
            setError("");

            const data = await getPresupuestosByCompany(companyId);
            setPresupuestos(data || []);
        } catch {
            setError(
                "No se pudieron cargar los presupuestos de la empresa."
            );
        } finally {
            setLoading(false);
        }
    }, [companyId]);

    const searchByTitle = async (title) => {
        try {
            setLoading(true);
            setError("");

            if (!title.trim()) {
                await fetchCompanyPresupuestos();
                return;
            }

            const data = await searchPresupuestosByTitle(title);

            const filteredByCompany = data.filter(
                (presupuesto) => Number(presupuesto.idCompany) === Number(companyId)
            );

            setPresupuestos(filteredByCompany);
        } catch (err) {
            setError(err.message || "Error al buscar presupuestos de la empresa");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyPresupuestos();
    }, [fetchCompanyPresupuestos]);

    const removePresupuesto = async (id) => {
        try {
            await deletePresupuesto(id);
            await fetchCompanyPresupuestos();
        } catch (err) {
            throw new Error(err.message || "Error al eliminar el presupuesto");
        }
    };

    return {
        presupuestos,
        loading,
        error,
        removePresupuesto,
        fetchCompanyPresupuestos,
        searchByTitle,
    };
}