import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";
import { formatPrice, getPlanFeatures } from "../../utils/settingsPlanFormatters";

function PlanOptionCard({ plan, isCurrent, currentPlanName }) {
    const isPopular = plan.name === "Pro" && currentPlanName !== "Business";

    return (
        <article
            className={`relative rounded-2xl border bg-card transition ${
                isCurrent
                    ? "border-red-300 shadow-lg ring-2 ring-red-100 dark:border-red-500/50 dark:ring-red-500/15"
                    : "border-border shadow-sm hover:border-muted-foreground/40 hover:shadow-md"
            }`}
        >
            {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        Más popular
                    </span>
                </div>
            )}

            <div className="flex flex-col p-6">
                <div className="mb-6 min-h-[76px]">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold text-foreground">
                            {plan.name}
                        </h3>

                        {isCurrent && (
                            <span className="shrink-0 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-300">
                                Actual
                            </span>
                        )}
                    </div>

                    <p className="mt-1 min-h-[40px] text-sm leading-5 text-muted-foreground">
                        {plan.description}
                    </p>
                </div>

                <div className="mb-6 border-y border-border py-6">
                    <p className="text-4xl font-bold text-foreground">
                        {formatPrice(plan.price)}
                        {plan.price > 0 && (
                            <span className="text-lg font-semibold text-muted-foreground">
                                {" "}
                                / mes
                            </span>
                        )}
                    </p>
                </div>

                <div className="mb-6 flex-1 space-y-3">
                    {getPlanFeatures(plan).map((feature) => (
                        <div
                            key={feature}
                            className="flex items-start gap-3 text-sm text-foreground/85"
                        >
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    disabled
                    className={`w-full rounded-lg py-2.5 text-sm font-semibold transition ${
                        isCurrent
                            ? "cursor-not-allowed bg-muted text-muted-foreground"
                            : "border border-input bg-background text-muted-foreground hover:bg-accent"
                    }`}
                >
                    {isCurrent ? "Tu plan actual" : "Proximamente"}
                </button>
            </div>
        </article>
    );
}

PlanOptionCard.propTypes = {
    plan: PropTypes.shape({
        idPlan: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        maxCompanies: PropTypes.number.isRequired,
        maxPresupuestos: PropTypes.number.isRequired,
        maxPdfExports: PropTypes.number.isRequired,
        pdfExportLimitPeriod: PropTypes.string.isRequired,
    }).isRequired,
    isCurrent: PropTypes.bool.isRequired,
    currentPlanName: PropTypes.string.isRequired,
};

export default PlanOptionCard;
