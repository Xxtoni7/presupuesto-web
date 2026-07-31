import PropTypes from "prop-types";
import { Crown } from "lucide-react";
import { formatCurrency } from "../../utils/dashboardFormatters";

function HighlightContent({ metrics }) {
    const hasBudget =
        metrics.highestBudgetTotal !== null &&
        metrics.highestBudgetTotal !== undefined;

    return (
        <section>
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                    <Crown className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground">
                        Presupuesto destacado
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        El presupuesto de mayor valor.
                    </p>
                </div>
            </div>

            {hasBudget ? (
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-white p-5 dark:from-amber-500/15 dark:via-card dark:to-card">
                    <p className="text-sm font-medium text-muted-foreground">
                        Mayor presupuesto
                    </p>

                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                        {formatCurrency(metrics.highestBudgetTotal)}
                    </h3>

                    <p className="mt-4 font-bold text-foreground">
                        {metrics.highestBudgetTitle || "Sin título"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Cliente: {metrics.highestBudgetClientName || "Sin cliente"}
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-6 text-center">
                    <p className="font-semibold text-foreground">
                        Sin presupuesto destacado
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Creá presupuestos para ver esta métrica.
                    </p>
                </div>
            )}
        </section>
    );
}

HighlightContent.propTypes = {
    metrics: PropTypes.shape({
        highestBudgetTotal: PropTypes.number,
        highestBudgetClientName: PropTypes.string,
        highestBudgetTitle: PropTypes.string,
    }).isRequired,
};

export default HighlightContent;