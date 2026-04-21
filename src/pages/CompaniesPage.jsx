import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grid, List, Building2, X } from "lucide-react";
import CompanyCard from "../components/company/CompanyCard";
import { useCompanies } from "../hooks/useCompanies";
import CompanyForm from "../components/company/CompanyForm";
import { createPortal } from "react-dom";
import { useSearch } from "../context/SearchContext";

function CompaniesPage() {
    const navigate = useNavigate();
    const { companies, loading, error, deleteCompany, fetchCompanies } = useCompanies();
    const [viewMode, setViewMode] = useState("grid");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);         

    const { searchTerm } = useSearch();

    const handleCreate = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = async (company) => {
        const companyId = company.idCompany ?? company.id;
        const confirmed = globalThis.confirm(
            `¿Está seguro de eliminar la empresa "${company.name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteCompany(companyId);
        } catch {
            // el error ya lo maneja el hook
        }
    };

    const handleViewBudgets = (companyId) => {
        navigate(`/companies/${companyId}/budgets`);
    };

    const normalizeText = (text) =>
        text
            ?.toLowerCase()
            .normalize("NFD")
            .replaceAll(/[\u0300-\u036f]/g, "");

    const filteredCompanies = companies.filter((company) => {
        const term = normalizeText(searchTerm.trim());

        if (!term) return true;

        return (
            normalizeText(company.name)?.includes(term) ||
            normalizeText(company.industry)?.includes(term) ||
            normalizeText(company.email)?.includes(term) ||
            normalizeText(company.phone)?.includes(term) ||
            normalizeText(company.address)?.includes(term)
        );
    });

    let content;

    if (loading) {
        content = (
        <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
            <p className="text-gray-500">Cargando empresas...</p>
        </div>
        );
    } else if (filteredCompanies.length === 0) {
        content = (
        <div className="py-20 text-center">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-[#9ca3af]" />
            <h3 className="mb-2 text-xl font-semibold text-[#111111]">
                No hay empresas registradas
            </h3>
            <p className="mb-6 text-sm text-[#6b7280]">
                Comience creando su primera empresa
            </p>
            <button
                type="button"
                onClick={handleCreate}
                className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white shadow hover:bg-red-600"
            >
                <Plus className="mr-2 h-4 w-4" />
                Crear primera empresa
            </button>
        </div>
        );
    } else if (viewMode === "grid") {
        content = (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanies.map((company) => (
            <CompanyCard
                key={company.idCompany ?? company.id}
                company={company}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewBudgets={handleViewBudgets}
            />
            ))}
        </div>
        );
    } else {
        content = (
        <div className="space-y-4">
            {companies.map((company) => (
            <CompanyCard
                key={company.idCompany ?? company.id}
                company={company}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewBudgets={handleViewBudgets}
            />
            ))}
        </div>
        );
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCompany(null);
    };

    const handleSuccess = async () => {
        await fetchCompanies();
        handleCloseModal();
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#111111]">Empresas</h1>
                    <p className="mt-1 text-sm text-[#6b7280]">
                        Gestione sus empresas y datos corporativos
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex rounded-lg border border-[#d1d5db] bg-white">
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition ${
                            viewMode === "grid"
                                ? "bg-red-500 text-white shadow-sm"
                                : "text-[#111111] hover:bg-gray-50"
                            }`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode("list")}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition ${
                            viewMode === "list"
                                ? "bg-red-500 text-white shadow-sm"
                                : "text-[#111111] hover:bg-gray-50"
                            }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white shadow hover:bg-red-600"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva empresa
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {content}

            {isModalOpen &&
            createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/80">
                    <div className="flex min-h-screen items-center justify-center px-4 py-6">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
                                <h2 className="text-lg font-semibold text-[#111111]">
                                    {editingCompany ? "Editar empresa" : "Nueva empresa"}
                                </h2>

                                <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="p-6">
                                <CompanyForm
                                company={editingCompany}
                                onSuccess={handleSuccess}
                                onCancel={handleCloseModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default CompaniesPage;