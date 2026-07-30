import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grid, List, Building2, X, Trash2 } from "lucide-react";
import CompanyCard from "../components/company/CompanyCard";
import CompanyTable from "../components/company/CompanyTable";
import { useCompanies } from "../hooks/useCompanies";
import CompanyForm from "../components/company/CompanyForm";
import { createPortal } from "react-dom";
import { useSearch } from "../context/SearchContext";
import { toast } from "sonner";

function CompaniesPage() {
    const navigate = useNavigate();
    const { companies, loading, error, deleteCompany, fetchCompanies } = useCompanies();
    const [viewMode, setViewMode] = useState("grid");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);         
    const { searchTerm } = useSearch();
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [isDeletingCompany, setIsDeletingCompany] = useState(false);

    const handleCreate = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = (company) => {
        setCompanyToDelete(company);
    };

    const handleCancelDelete = () => {
        setCompanyToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!companyToDelete) return;

        const companyId = companyToDelete.idCompany ?? companyToDelete.id;

        try {
            setIsDeletingCompany(true);

            await deleteCompany(companyId);

            setCompanyToDelete(null);

            toast.success("Empresa eliminada correctamente", {
                duration: 2000,
            });
        } catch {
            toast.error("Error al eliminar la empresa", {
                duration: 2000,
            });
            // el error ya lo maneja el hook
        } finally {
            setIsDeletingCompany(false);
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
            <p className="text-muted-foreground">Cargando empresas...</p>
        </div>
        );
    } else if (filteredCompanies.length === 0) {
        content = (
        <div className="py-20 text-center">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
                No hay empresas registradas
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
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
            <CompanyTable
                companies={filteredCompanies}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewBudgets={handleViewBudgets}
            />
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Empresas</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestione sus empresas y datos corporativos
                    </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    <div className="flex rounded-lg border border-input bg-card">
                        <button
                            type="button"
                            aria-label="Ver empresas como tarjetas"
                            aria-pressed={viewMode === "grid"}
                            onClick={() => setViewMode("grid")}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition ${
                            viewMode === "grid"
                                ? "bg-red-500 text-white shadow-sm"
                                : "text-foreground hover:bg-accent"
                            }`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Ver empresas como lista"
                            aria-pressed={viewMode === "list"}
                            onClick={() => setViewMode("list")}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition ${
                            viewMode === "list"
                                ? "bg-red-500 text-white shadow-sm"
                                : "text-foreground hover:bg-accent"
                            }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white shadow hover:bg-red-600 sm:flex-none"
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
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl">
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <h2 className="text-lg font-semibold text-foreground">
                                    {editingCompany ? "Editar empresa" : "Nueva empresa"}
                                </h2>

                                <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
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

            {companyToDelete &&
                createPortal(
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Eliminar empresa
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm leading-6 text-muted-foreground">
                                ¿Seguro que querés eliminar{" "}
                                <span className="font-semibold text-foreground">
                                    “{companyToDelete.name}”
                                </span>?
                            </p>

                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                                También se eliminarán los presupuestos asociados a esta empresa.
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelDelete}
                                    disabled={isDeletingCompany}
                                    className="rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-60"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeletingCompany}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-60"
                                >
                                    {isDeletingCompany ? "Eliminando..." : "Eliminar empresa"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
}

export default CompaniesPage;
