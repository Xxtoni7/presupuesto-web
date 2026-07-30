import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { formatCurrency, formatDate } from "../../utils/dashboardFormatters";
import EmptyRecentPresupuestosCta from "./EmptyRecentPresupuestosCta";

function RecentPresupuestosContent({ presupuestos, onboarding, onNavigate }) {
    const visiblePresupuestos = presupuestos.slice(0, 5);

    return (
        <section className="p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-foreground">
                        Últimos presupuestos
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Tus presupuestos más recientes.
                    </p>
                </div>

                {visiblePresupuestos.length > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("/budgets")}
                    >
                        Ver todos
                    </Button>
                )}
            </div>

            {visiblePresupuestos.length === 0 ? (
                <EmptyRecentPresupuestosCta
                    onboarding={onboarding}
                    onNavigate={onNavigate}
                />
            ) : (
                <div className="space-y-3">
                    {visiblePresupuestos.map((presupuesto) => (
                        <button
                            key={presupuesto.idPresupuesto}
                            type="button"
                            onClick={() => onNavigate("/budgets")}
                            className="w-full rounded-2xl border border-border bg-muted/45 px-4 py-3 text-left transition hover:border-red-300/50 hover:bg-red-50/50 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
                        >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                                        {presupuesto.budgetNumber || "Sin número"}
                                    </p>

                                    <h3 className="mt-1 truncate font-bold text-foreground">
                                        {presupuesto.title || "Sin título"}
                                    </h3>

                                    <p className="mt-1 truncate text-sm text-muted-foreground">
                                        {presupuesto.clientName || "Sin cliente"} ·{" "}
                                        {presupuesto.companyName || "Sin empresa"}
                                    </p>
                                </div>

                                <div className="shrink-0 md:text-right">
                                    <p className="font-bold text-foreground">
                                        {formatCurrency(presupuesto.total)}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(presupuesto.fechaPresupuesto)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

RecentPresupuestosContent.propTypes = {
    presupuestos: PropTypes.arrayOf(
        PropTypes.shape({
            idPresupuesto: PropTypes.number.isRequired,
            budgetNumber: PropTypes.string,
            title: PropTypes.string,
            clientName: PropTypes.string,
            companyName: PropTypes.string,
            total: PropTypes.number,
            fechaPresupuesto: PropTypes.string,
        })
    ).isRequired,
    onboarding: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        actionLabel: PropTypes.string,
        actionUrl: PropTypes.string,
    }),
    onNavigate: PropTypes.func.isRequired,
};

export default RecentPresupuestosContent;