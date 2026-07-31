import { useMemo } from "react";
import PropTypes from "prop-types";
import { CalendarDays, FileText, Plus, TrendingUp, WalletCards } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency, formatDate, getUserLabel } from "../../utils/dashboardFormatters";
import MetricStripItem from "./MetricStripItem";

function DashboardTopPanel({ user, summary, onNavigate }) {
    const { metrics } = summary;

    const metricsItems = useMemo(
        () => [
            {
                title: "Total presupuestado",
                value: formatCurrency(metrics.totalBudgeted),
                icon: WalletCards,
                isMoney: true,
            },
            {
                title: "Promedio por presupuesto",
                value: formatCurrency(metrics.averageBudgetAmount),
                icon: TrendingUp,
                isMoney: true,
            },
            {
                title: "Presupuestos cargados",
                value: metrics.totalPresupuestos || 0,
                icon: FileText,
                isMoney: false,
            },
            {
                title: "Último presupuesto",
                value: formatDate(metrics.lastPresupuestoDate),
                icon: CalendarDays,
                isMoney: false,
            },
        ],
        [metrics]
    );

    return (
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">
                        ¡Bienvenido, {getUserLabel(user)}! 👋
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Resumen general de tu actividad y tus presupuestos.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                        type="button"
                        onClick={() => onNavigate("/companies")}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear presupuesto
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onNavigate("/budgets")}
                    >
                        Ver presupuestos
                    </Button>
                </div>
            </div>

            <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
                {metricsItems.map((item) => (
                    <MetricStripItem
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        description={item.description}
                        icon={item.icon}
                        isMoney={item.isMoney}
                    />
                ))}
            </div>
        </section>
    );
}

DashboardTopPanel.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string,
    }),
    summary: PropTypes.shape({
        metrics: PropTypes.object.isRequired,
    }).isRequired,
    onNavigate: PropTypes.func.isRequired,
};

export default DashboardTopPanel;