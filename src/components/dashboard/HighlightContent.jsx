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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Crown className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-[#111111]">
                        Presupuesto destacado
                    </h2>

                    <p className="text-sm text-gray-500">
                        El presupuesto de mayor valor.
                    </p>
                </div>
            </div>

            {hasBudget ? (
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-white p-5">
                    <p className="text-sm font-medium text-gray-500">
                        Mayor presupuesto
                    </p>

                    <h3 className="mt-2 text-3xl font-bold tracking-tight text-[#111111]">
                        {formatCurrency(metrics.highestBudgetTotal)}
                    </h3>

                    <p className="mt-4 font-bold text-[#111111]">
                        {metrics.highestBudgetTitle || "Sin título"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Cliente: {metrics.highestBudgetClientName || "Sin cliente"}
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                    <p className="font-semibold text-gray-700">
                        Sin presupuesto destacado
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
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