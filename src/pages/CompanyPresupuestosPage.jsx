import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Grid, List, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import PresupuestoCard from "../components/presupuesto/PresupuestoCard";
import PresupuestoTable from "../components/presupuesto/PresupuestoTable";
import { useSearch } from "../context/SearchContext";
import { useCompanyPresupuestos } from "../hooks/useCompanyPresupuestos";
import PresupuestoPreview from "../components/presupuesto/PresupuestoPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "../components/ui/dialog";
import { getItemsByPresupuesto } from "../api/presupuestoItemApi";
import { getCompanyById } from "../api/companyApi";

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
    const { presupuestos, loading, error, removePresupuesto } = useCompanyPresupuestos(companyId);
    const [viewMode, setViewMode] = useState("grid");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
    const [previewItems, setPreviewItems] = useState([]);
    const [companyData, setCompanyData] = useState(null);
    
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

    const handleDelete = async (presupuesto) => {
        const confirmed = globalThis.confirm(
            `¿Está seguro de eliminar el presupuesto "${presupuesto.title || presupuesto.budgetNumber}"?`
        );

        if (!confirmed) return;

        try {
            await removePresupuesto(presupuesto.idPresupuesto);
        } catch (err) {
            alert(err.message || "Error al eliminar el presupuesto");
        }
    };

    const handleDuplicate = () => {
        // TODO: implementar duplicado de presupuesto junto con sus ítems
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

    const handleDownload = () => {
        // TODO: implementar descarga PDF del presupuesto
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
        </div>
    );
}

export default CompanyPresupuestosPage;