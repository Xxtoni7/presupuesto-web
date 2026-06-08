import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Grid, List, Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import PresupuestoCard from "../components/presupuesto/PresupuestoCard";
import PresupuestoTable from "../components/presupuesto/PresupuestoTable";
import { useSearch } from "../context/SearchContext";
import { useCompanyPresupuestos } from "../hooks/useCompanyPresupuestos";
import PresupuestoPreview from "../components/presupuesto/PresupuestoPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "../components/ui/dialog";
import { getItemsByPresupuesto } from "../api/presupuestoItemApi";
import { getCompanyById } from "../api/companyApi";
import { authorizePresupuestoPdfExport } from "../api/presupuestoApi";
import { duplicatePresupuesto } from "../services/presupuestoService";
import { generatePresupuestoPdf } from "../utils/pdf/presupuestoPdf/generatePresupuestoPdf";
import { toast } from "sonner";


function normalizeText(text) {
    return text
    ?.toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");
}

function CompanyPresupuestosPage() {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { searchTerm } = useSearch();
    const { presupuestos, loading, error, removePresupuesto, fetchCompanyPresupuestos } = useCompanyPresupuestos(companyId);
    const [viewMode, setViewMode] = useState("grid");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
    const [previewItems, setPreviewItems] = useState([]);
    const [companyData, setCompanyData] = useState(null);
    const [presupuestoToDelete, setPresupuestoToDelete] = useState(null);
    const [isDeletingPresupuesto, setIsDeletingPresupuesto] = useState(false);
    const [pdfGeneratingId, setPdfGeneratingId] = useState(null);
    
    useEffect(() => {
        const loadCompany = async () => {
            try {
                const company = await getCompanyById(companyId);
                setCompanyData(company);
            } catch {
                // silencioso
            }
        };

        loadCompany();
    }, [companyId]);

    const filteredPresupuestos = useMemo(() => {
        const term = normalizeText(searchTerm.trim());

        if (!term) return presupuestos;

        return presupuestos.filter((presupuesto) => (
            normalizeText(presupuesto.title)?.includes(term) ||
            normalizeText(presupuesto.budgetNumber)?.includes(term) ||
            normalizeText(presupuesto.clientName)?.includes(term) ||
            normalizeText(presupuesto.workAddress)?.includes(term)
        ));
    }, [presupuestos, searchTerm]);

    const handleEdit = (presupuesto) => {
        navigate(`/companies/${companyId}/budgets/${presupuesto.idPresupuesto}/edit`);
    };

    const handleDelete = (presupuesto) => {
        setPresupuestoToDelete(presupuesto);
    };

    const handleCancelDelete = () => {
        setPresupuestoToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!presupuestoToDelete) return;

        try {
            setIsDeletingPresupuesto(true);

            await removePresupuesto(presupuestoToDelete.idPresupuesto);

            setPresupuestoToDelete(null);

            toast.success("Presupuesto eliminado correctamente", {
                description: `${
                    presupuestoToDelete.budgetNumber ||
                    presupuestoToDelete.title ||
                    "El presupuesto"
                } fue eliminado.`,
                duration: 2000,
            });
        } catch (err) {
            toast.error("No se pudo eliminar el presupuesto", {
                description: err.message || "Intentá nuevamente en unos segundos.",
                duration: 3500,
            });
        } finally {
            setIsDeletingPresupuesto(false);
        }
    };

    const handleDuplicate = async (presupuesto) => {
        const toastId = toast.loading("Duplicando presupuesto...", {
            description: "Estamos creando una copia del presupuesto.",
        });

        try {
            await duplicatePresupuesto(presupuesto);

            await fetchCompanyPresupuestos();

            toast.success("Presupuesto duplicado correctamente", {
                id: toastId,
                description: `Se creó una copia de ${
                    presupuesto.budgetNumber || presupuesto.title || "este presupuesto"
                }.`,
                duration: 3500,
            });
        } catch (error) {
            toast.error("No se pudo duplicar el presupuesto", {
                id: toastId,
                description: error.message || "Intentá nuevamente en unos segundos.",
                duration: 4500,
            });
        }
    };

    const handlePreview = async (presupuesto) => {
        try {
            const items = await getItemsByPresupuesto(
                presupuesto.idPresupuesto
            );

            setSelectedPresupuesto(presupuesto);
            setPreviewItems(items);
            setPreviewOpen(true);
        } catch {
            alert("No se pudo abrir la vista previa");
        }
    };

    const handleDownload = async (presupuesto) => {
        const presupuestoId = presupuesto.idPresupuesto;
        if (pdfGeneratingId === presupuestoId) return;
        const toastId = toast.loading("Generando PDF...", {
            description: "Estamos validando tu plan y preparando el presupuesto.",
        });

        try {
            setPdfGeneratingId(presupuestoId);
            await authorizePresupuestoPdfExport(presupuestoId);
            const items = await getItemsByPresupuesto(presupuestoId);

            await generatePresupuestoPdf(
                presupuesto,
                companyData,
                items
            );

            toast.success("PDF generado correctamente", {
                id: toastId,
                description: `Se descargó ${presupuesto.budgetNumber || "el presupuesto"}.`,
                duration: 3500,
            });
        } catch (err) {
            const isPdfLimitError = err.status === 403;

            toast.error(
                isPdfLimitError ? "Límite de PDF alcanzado" : "No se pudo generar el PDF",
                {
                    id: toastId,
                    description: err.message || "Intentá nuevamente en unos segundos.",
                    duration: isPdfLimitError ? 7000 : 4500,
                    action: isPdfLimitError
                        ? {
                            label: "Ver planes",
                            onClick: () => navigate("/settings"),
                        }
                        : undefined,
                }
            );
        } finally {
            setPdfGeneratingId(null);
        }
    };
    let content;

    if (loading) {
        content = (
            <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                <p className="text-[#6b7280]">Cargando presupuestos...</p>
            </div>
        );
    } else if (error) {
        content = (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {"Error al obtener los presupuestos, intente recargar la página. "}
                {error}
            </div>
        );
    } else if (filteredPresupuestos.length === 0) {
        content = (
            <div className="py-20 text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-[#9ca3af]" />
                <h3 className="mb-2 text-xl font-semibold text-[#111111]">
                    No hay presupuestos
                </h3>
                <p className="mb-6 text-sm text-[#6b7280]">
                    Comience creando el primer presupuesto para esta empresa
                </p>

                <Link to={`/companies/${companyId}/budgets/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear primer presupuesto
                    </Button>
                </Link>
            </div>
        );
    } else if (viewMode === "grid") {
        content = (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPresupuestos.map((presupuesto) => (
                    <PresupuestoCard
                        key={presupuesto.idPresupuesto}
                        presupuesto={presupuesto}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                        onPreview={handlePreview}
                        onDownload={handleDownload}
                        isPdfGenerating={pdfGeneratingId === presupuesto.idPresupuesto}
                    />
                ))}
            </div>
        );
    } else {
        content = (
            <PresupuestoTable
                presupuestos={filteredPresupuestos}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onPreview={handlePreview}
                onDownload={handleDownload}
                pdfGeneratingId={pdfGeneratingId}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <Link to="/companies">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>

                        <h1 className="text-3xl font-bold text-[#111111]">
                            Presupuestos
                        </h1>
                    </div>

                    <p className="text-sm text-[#6b7280]">
                        Gestione los presupuestos de esta empresa
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="flex rounded-lg border border-[#e5e7eb] bg-white">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Link to={`/companies/${companyId}/budgets/new`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo presupuesto
                        </Button>
                    </Link>
                </div>
            </div>

            {content}

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto p-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Vista previa del presupuesto</DialogTitle>
                        <DialogDescription>
                            Visualización completa del presupuesto seleccionado.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPresupuesto && (
                        <PresupuestoPreview
                            presupuesto={selectedPresupuesto}
                            company={companyData}
                            items={previewItems}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {presupuestoToDelete &&
                createPortal(
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Eliminar presupuesto
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Esta acción no se puede deshacer.
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm leading-6 text-gray-600">
                                ¿Seguro que querés eliminar{" "}
                                <span className="font-semibold text-gray-900">
                                    “{presupuestoToDelete.title ||
                                        presupuestoToDelete.budgetNumber ||
                                        "este presupuesto"}”
                                </span>?
                            </p>

                            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                                Se eliminará este presupuesto.
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelDelete}
                                    disabled={isDeletingPresupuesto}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeletingPresupuesto}
                                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-60"
                                >
                                    {isDeletingPresupuesto
                                        ? "Eliminando..."
                                        : "Eliminar presupuesto"}
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

export default CompanyPresupuestosPage;