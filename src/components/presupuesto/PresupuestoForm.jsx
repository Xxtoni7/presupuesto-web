import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Calculator } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import PresupuestoItemsTable from "./PresupuestoItemsTable";
import { emptyPresupuesto } from "../../types/presupuesto";
import { emptyPresupuestoItem } from "../../types/presupuestoItem";
import { formatCurrency } from "../../utils/formatCurrency";
import { getTodayDateInputValue, toDateInputValue } from "../../utils/dateHelpers";
import { createPresupuesto, updatePresupuesto} from "../../api/presupuestoApi";
import { createPresupuestoItem, updatePresupuestoItem, deletePresupuestoItem, getItemsByPresupuesto} from "../../api/presupuestoItemApi";
import RichTextEditor from "../ui/RichTextEditor";


function PresupuestoForm({ presupuesto = null, companyId, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        ...emptyPresupuesto,
        fechaPresupuesto: getTodayDateInputValue(),
        fechaVencimiento: "",
        idCompany: companyId,
    });

    const [items, setItems] = useState([{ ...emptyPresupuestoItem }]);
    const [deletedItemIds, setDeletedItemIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!presupuesto) return;

        setFormData({
            title: presupuesto.title || "",
            clientName: presupuesto.clientName || "",
            fechaPresupuesto: toDateInputValue(presupuesto.fechaPresupuesto),
            fechaVencimiento: toDateInputValue(presupuesto.fechaVencimiento),
            workAddress: presupuesto.workAddress || "",
            jobDescription: presupuesto.jobDescription || "",
            estimatedTime: presupuesto.estimatedTime || "",
            paymentTerms: presupuesto.paymentTerms || "",
            observations: presupuesto.observations || "",
            idCompany: presupuesto.idCompany || companyId,
        });
    }, [presupuesto, companyId]);

    useEffect(() => {
        const loadItems = async () => {
            if (!presupuesto?.idPresupuesto) return;

            try {
                const data = await getItemsByPresupuesto(presupuesto.idPresupuesto);

                if (data.length === 0) {
                    setItems([{ ...emptyPresupuestoItem }]);
                    return;
                }

                setItems(
                    data.map((item) => ({
                        idItem: item.idItem,
                        description: item.description || "",
                        materials: item.materials ?? "",
                        labor: item.labor ?? "",
                        quantity: item.quantity ?? 1,
                        subtotal: item.subtotal ?? 0,
                    }))
                );
            } catch {
                setError("No se pudieron cargar los ítems del presupuesto.");
            }
        };

        loadItems();
    }, [presupuesto]);

    const visualTotal = useMemo(() => {
        return items.reduce((total, item) => total + (Number(item.subtotal) || 0), 0);
    }, [items]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const buildPresupuestoPayload = () => ({
        title: formData.title,
        clientName: formData.clientName,
        fechaPresupuesto: formData.fechaPresupuesto,
        fechaVencimiento: formData.fechaVencimiento || null,
        workAddress: formData.workAddress,
        jobDescription: formData.jobDescription,
        estimatedTime: formData.estimatedTime,
        paymentTerms: formData.paymentTerms,
        observations: formData.observations,
        idCompany: Number(companyId),
    });

    const buildItemPayload = (item, idPresupuesto) => ({
        description: item.description,
        materials: Number(item.materials) || 0,
        labor: Number(item.labor) || 0,
        quantity: Number(item.quantity) || 1,
        idPresupuesto,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.title.trim()) {
            setError("El título del presupuesto es obligatorio.");
            return;
        }

        if (!formData.clientName.trim()) {
            setError("El nombre del cliente es obligatorio.");
            return;
        }

        const validItems = items.filter((item) => item.description.trim());

        if (validItems.length === 0) {
            setError("Debe agregar al menos un ítem al presupuesto.");
            return;
        }

        try {
            setLoading(true);

            let savedPresupuesto;

            if (presupuesto?.idPresupuesto) {
                savedPresupuesto = await updatePresupuesto(
                    presupuesto.idPresupuesto,
                    buildPresupuestoPayload()
                );
            } else {
                savedPresupuesto = await createPresupuesto(buildPresupuestoPayload());
            }

            const presupuestoId = savedPresupuesto.idPresupuesto;

            for (const itemId of deletedItemIds) {
                await deletePresupuestoItem(itemId);
            }

            for (const item of validItems) {
                const itemPayload = buildItemPayload(item, presupuestoId);

                if (item.idItem) {
                    await updatePresupuestoItem(item.idItem, itemPayload);
                } else {
                    await createPresupuestoItem(itemPayload);
                }
            }

            onSuccess();
        } catch (err) {
            setError(err.message || "Error al guardar el presupuesto.");
        } finally {
            setLoading(false);
        }
    };

    let submitButtonText = "Crear presupuesto";
    if (loading) {
        submitButtonText = "Guardando...";
    } else if (presupuesto) {
        submitButtonText = "Actualizar presupuesto";
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="title">Título del presupuesto</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej: Remodelación de cocina"
                        required
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <Label htmlFor="clientName">Nombre del cliente</Label>
                    <Input
                        id="clientName"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="Nombre completo o razón social"
                        required
                        className="mt-1.5"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="fechaPresupuesto">Fecha del presupuesto</Label>
                    <Input
                        id="fechaPresupuesto"
                        name="fechaPresupuesto"
                        type="date"
                        value={formData.fechaPresupuesto}
                        onChange={handleChange}
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <Label htmlFor="fechaVencimiento">Fecha vencimiento del presupuesto</Label>
                    <Input
                        id="fechaVencimiento"
                        name="fechaVencimiento"
                        type="date"
                        value={formData.fechaVencimiento}
                        onChange={handleChange}
                        required
                        className="mt-1.5"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="workAddress">Dirección de la obra</Label>
                <Input
                    id="workAddress"
                    name="workAddress"
                    value={formData.workAddress}
                    onChange={handleChange}
                    placeholder="Dirección donde se realizará el trabajo"
                    className="mt-1.5"
                />
            </div>

            <div>
                <Label htmlFor="jobDescription">Descripción del trabajo</Label>
                <div className="mt-1.5">
                    <RichTextEditor
                        value={formData.jobDescription}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                jobDescription: value,
                            }))
                        }
                        placeholder="Descripción general del trabajo a realizar..."
                    />
                </div>
            </div>

            <PresupuestoItemsTable
                items={items}
                setItems={setItems}
                deletedItemIds={deletedItemIds}
                setDeletedItemIds={setDeletedItemIds}
            />

            <div className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white p-5">
                <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-red-500" />
                    <span className="text-lg font-semibold text-[#111111]">
                        Total del presupuesto
                    </span>
                </div>

                <span className="text-2xl font-bold text-red-500">
                    {formatCurrency(visualTotal)}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="estimatedTime">Tiempo estimado</Label>
                    <Input
                        id="estimatedTime"
                        name="estimatedTime"
                        value={formData.estimatedTime}
                        onChange={handleChange}
                        placeholder="Ej: 15 días hábiles"
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <Label htmlFor="paymentTerms">Condiciones de pago</Label>
                    <Textarea
                            id="paymentTerms"
                            name="paymentTerms"
                            value={formData.paymentTerms}
                            onChange={handleChange}
                            placeholder={`Ej: 50% anticipo para inicio de obra, 50% restante al finalizar`}
                            rows={1}
                            className="mt-1.5 min-h-[30px] resize-y"
                        />
                </div>
            </div>

            <div>
                <Label htmlFor="observations">Observaciones finales</Label>
                <Textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    placeholder="Notas adicionales, garantías, condiciones especiales..."
                    rows={3}
                    className="mt-1.5"
                />
            </div>

            <div className="flex gap-3 border-t border-[#e5e7eb] pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>

                <Button type="submit" disabled={loading}>
                    {submitButtonText}
                </Button>
            </div>
        </form>
    );
}

PresupuestoForm.propTypes = {
    presupuesto: PropTypes.shape({
        idPresupuesto: PropTypes.number,
        title: PropTypes.string,
        clientName: PropTypes.string,
        fechaPresupuesto: PropTypes.string,
        fechaVencimiento: PropTypes.string,
        workAddress: PropTypes.string,
        jobDescription: PropTypes.string,
        estimatedTime: PropTypes.string,
        paymentTerms: PropTypes.string,
        observations: PropTypes.string,
        idCompany: PropTypes.number,
    }),
    companyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default PresupuestoForm;