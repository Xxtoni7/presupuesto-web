import PropTypes from "prop-types";
import { Building2, Download, FileText, Gauge } from "lucide-react";
import UsageProgress from "./UsageProgress";

function PlanUsageContent({ plan, usage, onNavigate }) {
    return (
        <section>
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-300">
                        <Gauge className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-foreground">
                            Uso del plan
                        </h2>

                        <p className="truncate text-sm text-muted-foreground">
                            Plan {plan.planName}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => onNavigate("/settings")}
                    className="shrink-0 text-sm font-semibold text-red-500 transition hover:text-red-600"
                >
                    Ver plan
                </button>
            </div>

            <div className="space-y-3">
                <UsageProgress
                    title="Empresas"
                    used={usage.companiesUsed}
                    max={plan.maxCompanies}
                    percentage={usage.companiesUsagePercentage}
                    icon={Building2}
                />

                <UsageProgress
                    title="Presupuestos"
                    used={usage.presupuestosUsed}
                    max={plan.maxPresupuestos}
                    percentage={usage.presupuestosUsagePercentage}
                    icon={FileText}
                />

                <UsageProgress
                    title="PDFs"
                    used={usage.pdfExportsUsed}
                    max={plan.maxPdfExports}
                    percentage={usage.pdfExportsUsagePercentage}
                    icon={Download}
                />
            </div>
        </section>
    );
}

PlanUsageContent.propTypes = {
    plan: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        maxCompanies: PropTypes.number.isRequired,
        maxPresupuestos: PropTypes.number.isRequired,
        maxPdfExports: PropTypes.number.isRequired,
    }).isRequired,
    usage: PropTypes.shape({
        companiesUsed: PropTypes.number.isRequired,
        presupuestosUsed: PropTypes.number.isRequired,
        pdfExportsUsed: PropTypes.number.isRequired,
        companiesUsagePercentage: PropTypes.number,
        presupuestosUsagePercentage: PropTypes.number,
        pdfExportsUsagePercentage: PropTypes.number,
    }).isRequired,
    onNavigate: PropTypes.func.isRequired,
};

export default PlanUsageContent;