import PropTypes from "prop-types";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Edit,
    Trash2,
    FileText,
} from "lucide-react";

function CompanyCard({ company, onEdit, onDelete, onViewBudgets }) {
    const companyId = company.idCompany ?? company.id;

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {company.logoUrl ? (
                        <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="h-16 w-16 rounded-lg border border-gray-200 object-contain"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                            <Building2 className="h-8 w-8 text-gray-400" />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-[#111111]">
                            {company.name}
                        </h3>

                        {company.industry && (
                            <p className="mb-3 text-sm text-gray-500">{company.industry}</p>
                        )}

                        <div className="space-y-1.5">
                            {company.phone && (
                                <div className="flex items-center gap-2 text-sm text-[#111111]">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{company.phone}</span>
                                </div>
                            )}

                            {company.email && (
                                <div className="flex items-center gap-2 text-sm text-[#111111]">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{company.email}</span>
                                </div>
                            )}

                            {company.address && (
                                <div className="flex items-center gap-2 text-sm text-[#111111]">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{company.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 border-t border-gray-200 p-4">
                <button
                type="button"
                onClick={() => onViewBudgets(companyId)}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-[#111111] transition hover:bg-gray-50"
                >
                    <FileText className="mr-2 h-4 w-4" />
                    Presupuestos
                </button>

                <button
                type="button"
                onClick={() => onEdit(company)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-[#111111] transition hover:bg-gray-50"
                >
                    <Edit className="h-4 w-4" />
                </button>

                <button
                type="button"
                onClick={() => onDelete(company)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white transition hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>
    );
}

CompanyCard.propTypes = {
    company: PropTypes.shape({
    idCompany: PropTypes.number,
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    industry: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewBudgets: PropTypes.func.isRequired,
};

export default CompanyCard;