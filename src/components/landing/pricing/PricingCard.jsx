import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Check, Info, Sparkles } from "lucide-react";
import { Button } from "../../ui/button";
import { formatPrice } from "./utils/pricingPlanFormatters";
import { buildPlanFeatures } from "./utils/pricingPlanFeatures";

function PricingCard({ plan, planIndex, registerPath, tooltip }) {
    const planName = plan.name ?? "Plan";
    const normalizedName = planName.trim().toLowerCase();
    const isPopular = normalizedName === "pro";
    const isFree = Number(plan.price) === 0;
    const features = buildPlanFeatures(plan);
    const planKey = plan.idPlan ?? `${normalizedName}-${planIndex}`;

    return (
        <article
            className={`pricing-card relative flex min-h-[570px] flex-col rounded-[2rem] border p-7 transition duration-300 hover:-translate-y-1 hover:z-30 focus-within:z-30 sm:p-8 ${
                isPopular
                    ? "border-red-500/60 bg-white/85 shadow-[0_32px_110px_rgba(185,28,28,0.20)] lg:-translate-y-4 lg:hover:-translate-y-5"
                    : "border-red-950/10 bg-white/65 shadow-[0_24px_80px_rgba(88,28,20,0.08)] backdrop-blur-xl"
            }`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-red-600/25">
                    <Sparkles className="h-4 w-4" />
                    Más elegido
                </div>
            )}

            <div
                className={`pointer-events-none absolute inset-0 rounded-[2rem] ${
                    isPopular
                        ? "bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_18rem)]"
                        : "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_18rem)]"
                }`}
            />

            <div className="relative z-10 flex h-full flex-col">
                <div>
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${
                            isPopular
                                ? "bg-red-100 text-red-700"
                                : "bg-red-950/[0.06] text-red-900"
                        }`}
                    >
                        {isFree ? "Ideal para empezar" : "Plan mensual"}
                    </span>

                    <h3 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-slate-950">
                        {planName}
                    </h3>

                    <p className="mt-3 min-h-[52px] text-sm font-medium leading-6 text-slate-600">
                        {plan.description}
                    </p>
                </div>

                <div className="mt-7 flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl">
                        {formatPrice(plan.price)}
                    </span>

                    {!isFree && (
                        <span className="pb-1 text-sm font-semibold text-slate-500">
                            / mes
                        </span>
                    )}
                </div>

                <Button
                    asChild
                    size="lg"
                    variant={isPopular ? "default" : "outline"}
                    className={`mt-7 h-12 w-full rounded-xl font-semibold ${
                        isPopular
                            ? "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700"
                            : "border-red-950/15 bg-white/55 text-slate-950 hover:border-red-500/30 hover:bg-white hover:text-red-800"
                    }`}
                >
                    <Link to={registerPath}>
                        {isFree ? "Empezar gratis" : `Elegir ${planName}`}
                    </Link>
                </Button>

                <div className="my-8 h-px bg-red-950/10" />

                <ul className="space-y-4">
                    {features.map((feature) => {
                        const FeatureIcon = feature.icon;
                        const tooltipKey = `${planKey}-${feature.key}`;
                        const tooltipId = `pricing-tooltip-${tooltipKey}`;
                        const isTooltipOpen =
                            tooltip.openTooltip === tooltipKey;

                        return (
                            <li
                                key={feature.key}
                                className="relative flex min-h-14 items-center gap-3 rounded-2xl border border-red-950/[0.06] bg-white/45 px-4 py-3"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                        isPopular
                                            ? "bg-red-100 text-red-700"
                                            : "bg-emerald-100 text-emerald-700"
                                    }`}
                                >
                                    <FeatureIcon className="h-4 w-4" />
                                </div>

                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />

                                    <span className="text-sm font-semibold leading-5 text-slate-700">
                                        {feature.label}
                                    </span>
                                </div>

                                <span
                                    className="relative ml-auto inline-flex"
                                    onMouseEnter={() => {
                                        tooltip.showTooltip(tooltipKey);
                                    }}
                                    onMouseLeave={() =>
                                        tooltip.closeTooltipIfOpen(tooltipKey)
                                    }
                                >
                                    <button
                                        type="button"
                                        data-pricing-tooltip-trigger
                                        aria-label={`Más información sobre ${feature.label}`}
                                        aria-expanded={isTooltipOpen}
                                        aria-describedby={
                                            isTooltipOpen
                                                ? tooltipId
                                                : undefined
                                        }
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-700 transition hover:bg-red-100 focus:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                        onClick={() =>
                                            tooltip.toggleTooltip(tooltipKey)
                                        }
                                        onFocus={() => {
                                            tooltip.showTooltip(tooltipKey);
                                        }}
                                        onBlur={() =>
                                            tooltip.closeTooltipIfOpen(
                                                tooltipKey,
                                            )
                                        }
                                    >
                                        <Info className="h-4 w-4" />
                                    </button>

                                    {isTooltipOpen && (
                                        <div
                                            id={tooltipId}
                                            role="tooltip"
                                            className="absolute bottom-full right-0 z-[70] mb-3 w-64 max-w-[calc(100vw-3rem)] rounded-xl bg-slate-950 px-4 py-3 text-left text-xs font-medium leading-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.30)]"
                                        >
                                            {feature.description}

                                            <span className="absolute -bottom-1.5 right-3 h-3 w-3 rotate-45 bg-slate-950" />
                                        </div>
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto pt-8">
                    <p className="text-center text-xs font-medium text-slate-500">
                        Podés cambiar de plan cuando lo necesites.
                    </p>
                </div>
            </div>
        </article>
    );
}

const PLAN_LIMIT_TYPE = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
]);

PricingCard.propTypes = {
    plan: PropTypes.shape({
        idPlan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        maxCompanies: PLAN_LIMIT_TYPE,
        maxPresupuestos: PLAN_LIMIT_TYPE,
        maxPdfExports: PLAN_LIMIT_TYPE,
        pdfExportLimitPeriod: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    }).isRequired,
    planIndex: PropTypes.number.isRequired,
    registerPath: PropTypes.string.isRequired,
    tooltip: PropTypes.shape({
        openTooltip: PropTypes.string,
        showTooltip: PropTypes.func.isRequired,
        closeTooltipIfOpen: PropTypes.func.isRequired,
        toggleTooltip: PropTypes.func.isRequired,
    }).isRequired,
};

export default PricingCard;
