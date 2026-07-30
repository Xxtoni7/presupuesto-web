import PropTypes from "prop-types";
import { Building2, Mail, Phone, MapPin, Edit, Trash2, FileText } from "lucide-react";

function CompanyCard({ company, onEdit, onDelete, onViewBudgets }) {
    const companyId = company.idCompany ?? company.id;

    return (
        <div className="flex h-full flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400/40 hover:shadow-lg">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {company.logoUrl ? (
                        <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="h-16 w-16 rounded-lg border border-border bg-white object-contain"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-lg font-semibold text-foreground">
                            {company.name}
                        </h3>

                        {company.industry && (
                            <p className="mb-3 text-sm text-muted-foreground">{company.industry}</p>
                        )}

                        <div className="space-y-1.5">
                            {company.phone && (
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{company.phone}</span>
                                </div>
                            )}

                            {company.email && (
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{company.email}</span>
                                </div>
                            )}

                            {company.address && (
                                <div className="flex items-center gap-2 text-sm text-foreground">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{company.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto flex gap-2 border-t border-border p-4">
                <button
                type="button"
                onClick={() => onViewBudgets(companyId)}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-input bg-background text-sm font-medium text-foreground transition hover:bg-accent"
                >
                    <FileText className="mr-2 h-4 w-4" />
                    Presupuestos
                </button>

                <button
                type="button"
                onClick={() => onEdit(company)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background text-foreground transition hover:bg-accent"
                >
                    <Edit className="h-4 w-4" />
                </button>

                <button
                type="button"
                onClick={() => onDelete(company)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background transition hover:bg-red-50 dark:hover:bg-red-500/10"
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