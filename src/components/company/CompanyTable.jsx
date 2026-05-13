import PropTypes from "prop-types";
import { Building2, Edit, FileText, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function getCompanyId(company) {
    return company.idCompany ?? company.id;
}

function CompanyTable({ companies, onEdit, onDelete, onViewBudgets }) {
    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Rubro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {companies.map((company) => {
                    const companyId = getCompanyId(company);
                    const logoSrc = company?.logoUrl
                        ? `${API_URL}${company.logoUrl}`
                        : null;

                    return (
                        <TableRow key={companyId}>
                            <TableCell>
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-white p-1">
                                        {logoSrc ? (
                                            <img
                                                src={logoSrc}
                                                alt={company.name || "Logo de empresa"}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <Building2 className="h-5 w-5 text-[#6b7280]" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-[#111111]">
                                            {company.name || "Sin nombre"}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="space-y-1">
                                    {company.phone && (
                                        <div className="flex items-center gap-2 text-sm text-[#374151]">
                                            <Phone className="h-4 w-4 text-[#6b7280]" />
                                            <span>{company.phone}</span>
                                        </div>
                                    )}

                                    {company.email && (
                                        <div className="flex items-center gap-2 text-sm text-[#374151]">
                                            <Mail className="h-4 w-4 text-[#6b7280]" />
                                            <span className="max-w-[360px] truncate">
                                                {company.email}
                                            </span>
                                        </div>
                                    )}

                                    {!company.phone && !company.email && (
                                        <span className="text-sm text-[#9ca3af]">
                                            Sin contacto
                                        </span>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex max-w-[260px] items-center gap-2 text-sm text-[#374151]">
                                    <MapPin className="h-4 w-4 shrink-0 text-[#6b7280]" />
                                    <span className="truncate">
                                        {company.address || "Sin dirección"}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <span className="text-sm text-[#374151]">
                                    {company.industry || "Sin rubro"}
                                </span>
                            </TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onViewBudgets(companyId)}
                                        title="Ver presupuestos"
                                    >
                                        <FileText className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onEdit(company)}
                                        title="Editar empresa"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onDelete(company)}
                                        title="Eliminar empresa"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

CompanyTable.propTypes = {
    companies: PropTypes.arrayOf(
        PropTypes.shape({
            idCompany: PropTypes.number,
            id: PropTypes.number,
            name: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
            address: PropTypes.string,
            industry: PropTypes.string,
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewBudgets: PropTypes.func.isRequired,
};

export default CompanyTable;