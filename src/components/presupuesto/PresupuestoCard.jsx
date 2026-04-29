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
import { Card, CardContent, CardFooter } from "../ui/card";
import { formatCurrency } from "../../utils/formatCurrency";

function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function PresupuestoCard({presupuesto, onEdit, onDelete, onDuplicate, onPreview, onDownload}) {
    return (
        <Card className="relative flex min-h-[355px] flex-col transition-all duration-200 hover:shadow-lg">
            <CardContent className="relative flex-1 pt-6 pb-16">
                <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-[#111111]">
                                {presupuesto.title || "Sin título"}
                            </h3>

                            <p className="mt-1 text-sm text-[#6b7280]">
                                {presupuesto.budgetNumber || "Sin número"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-[#e5e7eb] pt-3">
                        <div className="flex items-center gap-2 text-sm text-[#111111]">
                            <User className="h-4 w-4 text-[#6b7280]" />
                            <span className="font-medium">
                                {presupuesto.clientName || "Sin cliente"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#111111]">
                            <Calendar className="h-4 w-4 text-[#6b7280]" />
                            <span>{formatDate(presupuesto.fechaPresupuesto)}</span>
                        </div>

                        {presupuesto.workAddress && (
                            <p className="truncate text-sm text-[#6b7280]">
                                {presupuesto.workAddress}
                            </p>
                        )}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <p className="text-2xl font-bold text-red-500">
                            {formatCurrency(presupuesto.total || 0)}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2 border-t border-[#e5e7eb] pt-4">
                <Button variant="outline" size="sm" onClick={() => onPreview(presupuesto)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                </Button>

                <Button variant="outline" size="sm" onClick={() => onEdit(presupuesto)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicate(presupuesto)}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(presupuesto)}
                >
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                </Button>

                    <Button variant="outline" size="sm" onClick={() => onDelete(presupuesto)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
            </CardFooter>
        </Card>
    );
}

PresupuestoCard.propTypes = {
    presupuesto: PropTypes.shape({
        idPresupuesto: PropTypes.number,
        title: PropTypes.string,
        budgetNumber: PropTypes.string,
        clientName: PropTypes.string,
        fechaPresupuesto: PropTypes.string,
        fechaVencimiento: PropTypes.string,
        workAddress: PropTypes.string,
        total: PropTypes.number,
        idCompany: PropTypes.number,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDuplicate: PropTypes.func.isRequired,
    onPreview: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default PresupuestoCard;