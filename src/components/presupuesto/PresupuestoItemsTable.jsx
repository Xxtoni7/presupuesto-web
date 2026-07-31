import PropTypes from "prop-types";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { formatCurrency } from "../../utils/formatCurrency";
import { emptyPresupuestoItem } from "../../types/presupuestoItem";

function PresupuestoItemsTable({ items, setItems, deletedItemIds, setDeletedItemIds }) {
    const handleItemChange = (index, field, value) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];

            const updatedItem = {
                ...updatedItems[index],
                [field]: value,
            };

            const materials = Number(updatedItem.materials) || 0;
            const labor = Number(updatedItem.labor) || 0;
            const quantity = Number(updatedItem.quantity) || 0;

            updatedItem.subtotal = (materials + labor) * quantity;

            updatedItems[index] = updatedItem;

            return updatedItems;
        });
    };

    const handleAddItem = () => {
        setItems((prevItems) => [...prevItems, { ...emptyPresupuestoItem }]);
    };

    const handleRemoveItem = (index) => {
        const itemToRemove = items[index];

        if (itemToRemove.idItem) {
            setDeletedItemIds((prevIds) => [...prevIds, itemToRemove.idItem]);
        }

        setItems((prevItems) => prevItems.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
        <div className="space-y-4 rounded-xl border border-border bg-card/40 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                    Detalle del presupuesto
                </h3>

                <Button type="button" size="sm" onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar ítem
                </Button>
            </div>

            {items.length === 0 && (
                <output
                    className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
                >
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p>
                        Si no agregás ítems, los importes escritos en la descripción no se usarán para calcular el total ni las estadísticas.
                    </p>
                </output>
            )}

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={item.idItem ?? index}
                        className="space-y-3 rounded-lg border border-border bg-background/60 p-4"
                    >
                        <Label className="text-xs">
                            Trabajo a realizar{" "}
                            <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Input
                            value={item.description}
                            onChange={(e) =>
                                handleItemChange(index, "description", e.target.value)
                            }
                            placeholder="Ej: Instalación, reparación, mantenimiento o servicio a realizar"
                            required
                        />
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                            <div>
                                <Label className="text-xs">Materiales</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={item.materials}
                                    onChange={(e) =>
                                        handleItemChange(index, "materials", e.target.value)
                                    }
                                    placeholder="0"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs">Mano de obra</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={item.labor}
                                    onChange={(e) =>
                                        handleItemChange(index, "labor", e.target.value)
                                    }
                                    placeholder="0"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs">Cantidad</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleItemChange(index, "quantity", e.target.value)
                                    }
                                    placeholder="1"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs">Subtotal</Label>
                                <Input
                                    value={formatCurrency(item.subtotal || 0)}
                                    readOnly
                                    className="mt-1 bg-muted"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                            >
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

PresupuestoItemsTable.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            idItem: PropTypes.number,
            description: PropTypes.string,
            materials: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            labor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            subtotal: PropTypes.number,
        })
    ).isRequired,
    setItems: PropTypes.func.isRequired,
    deletedItemIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    setDeletedItemIds: PropTypes.func.isRequired,
};

export default PresupuestoItemsTable;