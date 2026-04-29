import PropTypes from "prop-types";
import {
    Calendar,
    User,
    Edit,
    Trash2,
    Copy,
    Eye,
    Download,
} from "lucide-react";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { formatCurrency } from "../../utils/formatCurrency";

function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR").format(date);
}

function PresupuestoTable({ presupuestos, onEdit, onDelete, onDuplicate, onPreview, onDownload }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {presupuestos.map((presupuesto) => (
                    <TableRow key={presupuesto.idPresupuesto}>
                        <TableCell>
                            <div className="min-w-0">
                                <p className="font-medium text-[#111111]">
                                    {presupuesto.title || "Sin título"}
                                </p>

                                <p className="text-sm text-[#6b7280]">
                                    {presupuesto.budgetNumber || "Sin número"}
                                </p>

                                {presupuesto.workAddress && (
                                    <p className="max-w-xs truncate text-sm text-[#6b7280]">
                                        {presupuesto.workAddress}
                                    </p>
                                )}
                            </div>
                        </TableCell>

                        <TableCell>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-[#6b7280]" />
                                <span>{presupuesto.clientName || "Sin cliente"}</span>
                            </div>
                        </TableCell>

                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[#6b7280]" />
                                <span className="text-sm">
                                    {formatDate(presupuesto.fechaPresupuesto)}
                                </span>
                            </div>
                        </TableCell>

                        <TableCell className="text-right">
                            <span className="text-lg font-semibold text-red-500">
                                {formatCurrency(presupuesto.total || 0)}
                            </span>
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPreview(presupuesto)}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEdit(presupuesto)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDuplicate(presupuesto)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDownload(presupuesto)}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDelete(presupuesto)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

PresupuestoTable.propTypes = {
    presupuestos: PropTypes.arrayOf(
        PropTypes.shape({
            idPresupuesto: PropTypes.number.isRequired,
            title: PropTypes.string,
            budgetNumber: PropTypes.string,
            clientName: PropTypes.string,
            fechaPresupuesto: PropTypes.string,
            workAddress: PropTypes.string,
            total: PropTypes.number,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default PresupuestoTable;