import PropTypes from "prop-types";
import { Plus, Trash2 } from "lucide-react";
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
        <div className="space-y-4 rounded-xl border border-[#e5e7eb] p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#111111]">
                    Ítems del presupuesto
                </h3>

                <Button type="button" size="sm" onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar ítem
                </Button>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={item.idItem ?? index}
                        className="space-y-3 rounded-lg border border-[#e5e7eb] p-4"
                    >
                        <Label className="text-xs">Descripción</Label>
                        <Input
                            value={item.description}
                            onChange={(e) =>
                                handleItemChange(index, "description", e.target.value)
                            }
                            placeholder="Ej: Revestimiento de paredes en living"
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
                                    className="mt-1 bg-[#f9fafb]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                                disabled={items.length === 1}
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