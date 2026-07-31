import { useRef } from "react";
import PropTypes from "prop-types";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import PricingCard from "./pricing/PricingCard";
import useAvailablePlans from "./pricing/hooks/useAvailablePlans";
import usePricingAnimations from "./pricing/hooks/usePricingAnimations";
import usePricingTooltip from "./pricing/hooks/usePricingTooltip";

function PricingPlans({ registerPath }) {
    const sectionRef = useRef(null);
    const { plans, isLoading, errorMessage, retry } = useAvailablePlans();
    const tooltip = usePricingTooltip();

    usePricingAnimations({
        sectionRef,
        plansCount: plans.length,
    });

    return (
        <section
            ref={sectionRef}
            id="planes"
            aria-labelledby="pricing-title"
            className="relative overflow-hidden border-t border-red-950/5 bg-[#F6E8E2] px-4 py-24 text-slate-950 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
        >
            <div className="pointer-events-none absolute left-[-12rem] top-16 h-96 w-96 rounded-full bg-red-400/[0.08] blur-[130px]" />

            <div className="pointer-events-none absolute right-[-10rem] top-[42%] h-96 w-96 rounded-full bg-rose-300/20 blur-[140px]" />

            <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 h-72 w-[52rem] -translate-x-1/2 rounded-full bg-white/35 blur-[120px]" />

            <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="pricing-intro inline-flex items-center gap-2 rounded-full border border-red-900/10 bg-white/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-800 shadow-sm backdrop-blur-xl">
                        <Sparkles className="h-4 w-4" />
                        Planes simples y claros
                    </span>

                    <h2
                        id="pricing-title"
                        className="pricing-intro mt-6 text-3xl font-bold tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl"
                    >
                        Elegí el plan que mejor se adapta a vos
                    </h2>

                    <p className="pricing-intro mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
                        Empezá gratis y mejorá tu plan cuando necesites más
                        empresas, presupuestos o exportaciones.
                    </p>
                </div>

                {isLoading && (
                    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="min-h-[560px] animate-pulse rounded-[2rem] border border-red-950/10 bg-white/55 p-7 shadow-[0_24px_80px_rgba(88,28,20,0.08)]"
                            >
                                <div className="h-4 w-20 rounded-full bg-red-950/10" />
                                <div className="mt-5 h-8 w-32 rounded-full bg-red-950/10" />
                                <div className="mt-4 h-12 w-40 rounded-full bg-red-950/10" />
                                <div className="mt-8 h-12 w-full rounded-xl bg-red-950/10" />

                                <div className="mt-10 space-y-4">
                                    <div className="h-14 rounded-2xl bg-red-950/10" />
                                    <div className="h-14 rounded-2xl bg-red-950/10" />
                                    <div className="h-14 rounded-2xl bg-red-950/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="mx-auto mt-16 max-w-xl rounded-[2rem] border border-red-300/40 bg-white/65 p-8 text-center shadow-[0_24px_80px_rgba(88,28,20,0.08)] backdrop-blur-xl">
                        <p className="text-base font-semibold text-slate-800">
                            {errorMessage}
                        </p>

                        <Button
                            type="button"
                            className="mt-5 bg-red-600 text-white hover:bg-red-700"
                            onClick={retry}
                        >
                            Volver a intentar
                        </Button>
                    </div>
                )}

                {!isLoading && !errorMessage && (
                    <div className="pricing-grid mt-16 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan, planIndex) => (
                            <PricingCard
                                key={plan.idPlan ?? planIndex}
                                plan={plan}
                                planIndex={planIndex}
                                registerPath={registerPath}
                                tooltip={tooltip}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

PricingPlans.propTypes = {
    registerPath: PropTypes.string.isRequired,
};

export default PricingPlans;
