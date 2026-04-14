import { useCallback, useEffect, useState } from "react";
import {
    getCompanies,
    deleteCompany as deleteCompanyApi,
    searchCompaniesByName,
} from "../api/companyApi";

export function useCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getCompanies();
            setCompanies(data);
        } catch (err) {
            setError(err.message || "Error al obtener empresas");
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCompanies = useCallback(async (name) => {
        try {
            setLoading(true);
            setError("");

            if (!name.trim()) {
                const data = await getCompanies();
                setCompanies(data);
                return;
            }

            const data = await searchCompaniesByName(name);
            setCompanies(data);
            } catch (err) {
                setError(err.message || "Error al buscar empresas");
            } finally {
                setLoading(false);
            }
    }, []);

    const deleteCompany = useCallback(async (id) => {
        try {
            setError("");
            await deleteCompanyApi(id);
            setCompanies((prev) =>
                prev.filter((company) => (company.idCompany ?? company.id) !== id)
        );
        } catch (err) {
            setError(err.message || "Error al eliminar empresa");
        throw err;
        }
    }, []);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    return {
        companies,
        loading,
        error,
        fetchCompanies,
        searchCompanies,
        deleteCompany,
    };
}