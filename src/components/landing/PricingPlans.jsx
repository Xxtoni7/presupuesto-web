import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, Check, Download, FileText, Info, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { getAvailablePlans } from "../../api/planApi";

gsap.registerPlugin(ScrollTrigger);

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
});

function isUnlimited(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === "string") {
        const normalizedValue = value.trim().toLowerCase();

        return (
            normalizedValue === "unlimited" ||
            normalizedValue === "ilimitado" ||
            normalizedValue === "ilimitada"
        );
    }

    return Number(value) === -1;
}

function formatNumber(value) {
    return new Intl.NumberFormat("es-AR").format(Number(value));
}

function formatPrice(price) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice === 0) {
        return "$0";
    }

    return CURRENCY_FORMATTER.format(numericPrice);
}

function getPdfPeriodLabel(period) {
    if (period === null || period === undefined || period === "") {
        return "";
    }

    if (typeof period === "number") {
        if (period === 0) {
            return "totales";
        }

        if (period === 2) {
            return "por mes";
        }
    }

    const normalizedPeriod = String(period).trim().toLowerCase();

    if (
        normalizedPeriod.includes("lifetime") ||
        normalizedPeriod.includes("total") ||
        normalizedPeriod.includes("vida")
    ) {
        return "totales";
    }

    if (
        normalizedPeriod.includes("month") ||
        normalizedPeriod.includes("mensual") ||
        normalizedPeriod.includes("mes")
    ) {
        return "por mes";
    }

    return "";
}

function getPdfDescription(plan) {
    if (isUnlimited(plan.maxPdfExports)) {
        return "Podés exportar todos los presupuestos que necesites, sin límite de cantidad.";
    }

    const periodLabel = getPdfPeriodLabel(plan.pdfExportLimitPeriod);

    if (periodLabel === "totales") {
        return "Es la cantidad total de PDFs que podés exportar con este plan. Este cupo no se reinicia.";
    }

    if (periodLabel === "por mes") {
        return "Es la cantidad de PDFs que podés exportar cada mes. El cupo se renueva mensualmente.";
    }

    return "Es la cantidad máxima de presupuestos que podés exportar en formato PDF con este plan.";
}

function buildPlanFeatures(plan) {
    const companiesUnlimited = isUnlimited(plan.maxCompanies);
    const budgetsUnlimited = isUnlimited(plan.maxPresupuestos);
    const pdfUnlimited = isUnlimited(plan.maxPdfExports);
    const companyLabel =
        Number(plan.maxCompanies) === 1 ? "empresa" : "empresas";

    return [
        {
            key: "companies",
            icon: Building2,
            label: companiesUnlimited
                ? "Empresas ilimitadas"
                : `Hasta ${formatNumber(plan.maxCompanies)} ${companyLabel}`,
            description: companiesUnlimited
                ? "Podés crear y administrar todas las empresas que necesites dentro de tu espacio de trabajo."
                : `Podés crear y administrar hasta ${formatNumber(
                    plan.maxCompanies,
                    )} ${companyLabel} dentro de tu espacio de trabajo.`,
        },
        {
            key: "budgets",
            icon: FileText,
            label: budgetsUnlimited
                ? "Presupuestos ilimitados"
                : `${formatNumber(plan.maxPresupuestos)} presupuestos`,
            description: budgetsUnlimited
                ? "Podés mantener todos los presupuestos activos que necesites, sin límite de cantidad."
                : `Podés mantener hasta ${formatNumber(
                        plan.maxPresupuestos,
                    )} presupuestos activos al mismo tiempo.`,
        },
        {
            key: "pdf",
            icon: Download,
            label: pdfUnlimited
                ? "Exportaciones PDF ilimitadas"
                : `${formatNumber(plan.maxPdfExports)} exportaciones PDF`,
            description: getPdfDescription(plan),
        },
    ];
}

function PricingPlans({ registerPath }) {
    const sectionRef = useRef(null);

    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [openTooltip, setOpenTooltip] = useState(null);

    function closeTooltipIfOpen(tooltipKey) {
        setOpenTooltip((currentTooltip) =>
            currentTooltip === tooltipKey ? null : currentTooltip,
        );
    }

    function toggleTooltip(tooltipKey) {
        setOpenTooltip((currentTooltip) =>
            currentTooltip === tooltipKey ? null : tooltipKey,
        );
    }

    useEffect(() => {
        let isMounted = true;

        async function loadPlans() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await getAvailablePlans();

                const availablePlans = Array.isArray(response)
                    ? response
                    : response?.data;

                if (!Array.isArray(availablePlans)) {
                    throw new TypeError("La API no devolvió una lista de planes.");
                }

                if (isMounted) {
                    setPlans(availablePlans);
                }
            } catch {
                if (isMounted) {
                    setErrorMessage(
                        "No pudimos cargar los planes en este momento.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadPlans();

        return () => {
            isMounted = false;
        };
    }, [reloadKey]);

    const sortedPlans = useMemo(() => {
        return [...plans].sort((firstPlan, secondPlan) => {
            return Number(firstPlan.price) - Number(secondPlan.price);
        });
    }, [plans]);

    useEffect(() => {
        if (!sectionRef.current || sortedPlans.length === 0) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".pricing-intro",
                {
                    autoAlpha: 0,
                    y: 28,
                    filter: "blur(8px)",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 72%",
                        once: true,
                    },
                },
            );

            gsap.fromTo(
                ".pricing-card",
                {
                    autoAlpha: 0,
                    y: 42,
                    scale: 0.97,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.14,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".pricing-grid",
                        start: "top 78%",
                        once: true,
                    },
                },
            );

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, [sortedPlans.length]);

    useEffect(() => {
        function handlePointerDown(event) {
            if (
                event.target instanceof Element &&
                event.target.closest("[data-pricing-tooltip-trigger]")
            ) {
                return;
            }

            setOpenTooltip(null);
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setOpenTooltip(null);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

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
                            onClick={() => {
                                setReloadKey((currentKey) => currentKey + 1);
                            }}
                        >
                            Volver a intentar
                        </Button>
                    </div>
                )}

                {!isLoading && !errorMessage && (
                    <div className="pricing-grid mt-16 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sortedPlans.map((plan, planIndex) => {
                            const planName = plan.name ?? "Plan";
                            const normalizedName = planName
                                .trim()
                                .toLowerCase();

                            const isPopular = normalizedName === "pro";
                            const isFree = Number(plan.price) === 0;
                            const features = buildPlanFeatures(plan);
                            const planKey =
                                plan.idPlan ?? `${normalizedName}-${planIndex}`;

                            return (
                                <article
                                    key={planKey}
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
                                                {isFree
                                                    ? "Ideal para empezar"
                                                    : "Plan mensual"}
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
                                            variant={
                                                isPopular
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className={`mt-7 h-12 w-full rounded-xl font-semibold ${
                                                isPopular
                                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700"
                                                    : "border-red-950/15 bg-white/55 text-slate-950 hover:border-red-500/30 hover:bg-white hover:text-red-800"
                                            }`}
                                        >
                                            <Link to={registerPath}>
                                                {isFree
                                                    ? "Empezar gratis"
                                                    : `Elegir ${planName}`}
                                            </Link>
                                        </Button>

                                        <div className="my-8 h-px bg-red-950/10" />

                                        <ul className="space-y-4">
                                            {features.map((feature) => {
                                                const FeatureIcon =
                                                    feature.icon;

                                                const tooltipKey = `${planKey}-${feature.key}`;
                                                const tooltipId = `pricing-tooltip-${tooltipKey}`;
                                                const isTooltipOpen =
                                                    openTooltip === tooltipKey;

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
                                                                setOpenTooltip(
                                                                    tooltipKey,
                                                                );
                                                            }}
                                                            onMouseLeave={() =>
                                                                closeTooltipIfOpen(
                                                                    tooltipKey,
                                                                )
                                                            }
                                                        >
                                                            <button
                                                                type="button"
                                                                data-pricing-tooltip-trigger
                                                                aria-label={`Más información sobre ${feature.label}`}
                                                                aria-expanded={
                                                                    isTooltipOpen
                                                                }
                                                                aria-describedby={
                                                                    isTooltipOpen
                                                                        ? tooltipId
                                                                        : undefined
                                                                }
                                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-700 transition hover:bg-red-100 focus:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                                                                onClick={() =>
                                                                    toggleTooltip(
                                                                        tooltipKey,
                                                                    )
                                                                }
                                                                onFocus={() => {
                                                                    setOpenTooltip(
                                                                        tooltipKey,
                                                                    );
                                                                }}
                                                                onBlur={() =>
                                                                    closeTooltipIfOpen(
                                                                        tooltipKey,
                                                                    )
                                                                }
                                                            >
                                                                <Info className="h-4 w-4" />
                                                            </button>

                                                            {isTooltipOpen && (
                                                                <div
                                                                    id={
                                                                        tooltipId
                                                                    }
                                                                    role="tooltip"
                                                                    className="absolute bottom-full right-0 z-[70] mb-3 w-64 max-w-[calc(100vw-3rem)] rounded-xl bg-slate-950 px-4 py-3 text-left text-xs font-medium leading-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.30)]"
                                                                >
                                                                    {
                                                                        feature.description
                                                                    }

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
                                                Podés cambiar de plan cuando lo
                                                necesites.
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
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
