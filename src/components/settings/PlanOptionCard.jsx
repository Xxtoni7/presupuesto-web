import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { formatPrice, getPlanFeatures } from "../../utils/settingsPlanFormatters";

function PlanOptionCard({ plan, isCurrent, currentPlanName }) {
    const isPopular = plan.name === "Pro" && currentPlanName !== "Business";

    return (
        <article
            className={`relative flex min-w-0 flex-col rounded-xl border bg-card ${
                isCurrent
                    ? "border-primary/40"
                    : "border-border/80"
            }`}
        >
            {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        Más popular
                    </span>
                </div>
            )}

            <div className="flex h-full flex-col p-4 sm:p-5">
                <div className="mb-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground">
                            {plan.name}
                        </h3>

                        {isCurrent && (
                            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-foreground">
                                Actual
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {plan.description}
                    </p>
                </div>

                <div className="mb-5 mt-auto border-b border-border/60 pb-5">
                    <p className="flex flex-wrap items-baseline gap-x-1 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                        {formatPrice(plan.price)}
                        {plan.price > 0 && (
                            <span className="text-xs font-normal tracking-normal text-muted-foreground">
                                {" "}
                                / mes
                            </span>
                        )}
                    </p>
                </div>

                <div className="mb-6 space-y-3">
                    {getPlanFeatures(plan).map((feature) => (
                        <div
                            key={feature}
                            className="flex items-start gap-2 text-sm text-foreground/85"
                        >
                            <CheckCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    disabled
                    variant="secondary"
                    className="w-full text-xs disabled:opacity-70"
                >
                    {isCurrent ? "Tu plan actual" : "Próximamente"}
                </Button>
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
