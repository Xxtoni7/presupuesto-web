import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, CalendarDays, Crown, Download, FileText, Gauge, Loader2, Plus, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { Button } from "../components/ui/button";
import { getDashboardSummary } from "../api/dashboardApi";
import { useAuth } from "../context/AuthContext";

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatPercent(value) {
    if (value === null || value === undefined) return null;

    return `${Math.round(Number(value))}%`;
}

function clampPercentage(value) {
    if (value === null || value === undefined) return null;

    return Math.min(Math.max(Number(value), 0), 100);
}

function isUnlimited(max, percentage) {
    return max === -1 || percentage === null || percentage === undefined;
}

function getUserLabel(user) {
    if (!user?.email) return "bienvenido";

    return user.email.split("@")[0];
}

function DashboardLoading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <Loader2 className="h-7 w-7 animate-spin text-red-500" />
                </div>

                <p className="font-semibold text-[#111111]">
                    Cargando tu Dashboard...
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    Estamos preparando tus métricas.
                </p>
            </div>
        </div>
    );
}

function MetricStripItem({ title, value, description, icon: Icon, isMoney = false }) {
    return (
        <div className="min-w-0 px-5 py-4">
            <div className="mb-3 flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isMoney
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                    }`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <p className="truncate text-sm font-semibold text-gray-500">
                    {title}
                </p>
            </div>

            <p
                className={`truncate text-2xl font-bold tracking-tight ${
                    isMoney ? "text-emerald-600" : "text-[#111111]"
                }`}
            >
                {value}
            </p>

            <p className="mt-1 truncate text-sm text-gray-500">{description}</p>
        </div>
    );
}

MetricStripItem.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    isMoney: PropTypes.bool,
};

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
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold tracking-tight text-[#111111]">
                        Bienvenido, {getUserLabel(user)} 👋
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
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

            <div className="grid divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
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

function EmptyRecentPresupuestosCta({ onboarding, onNavigate }) {
    const title = onboarding?.title || "Creá tu primer presupuesto";
    const description =
        onboarding?.description ||
        "Empezá cargando tu empresa y creando tu primer presupuesto profesional.";
    const actionLabel = onboarding?.actionLabel || "Crear empresa";
    const actionUrl = onboarding?.actionUrl || "/companies";

    return (
        <section className="rounded-2xl bg-[#111111] p-6 text-white">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-red-300" />
                Siguiente paso
            </div>

            <h3 className="text-2xl font-bold">{title}</h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                {description}
            </p>

            <button
                type="button"
                onClick={() => onNavigate(actionUrl)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#111111] transition hover:bg-gray-100"
            >
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
            </button>
        </section>
    );
}

EmptyRecentPresupuestosCta.propTypes = {
    onboarding: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        actionLabel: PropTypes.string,
        actionUrl: PropTypes.string,
    }),
    onNavigate: PropTypes.func.isRequired,
};

function RecentPresupuestosContent({ presupuestos, onboarding, onNavigate }) {
    const visiblePresupuestos = presupuestos.slice(0, 5);

    return (
        <section className="p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-[#111111]">
                        Últimos presupuestos
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
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
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition hover:border-red-100 hover:bg-red-50/50"
                        >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                                        {presupuesto.budgetNumber || "Sin número"}
                                    </p>

                                    <h3 className="mt-1 truncate font-bold text-[#111111]">
                                        {presupuesto.title || "Sin título"}
                                    </h3>

                                    <p className="mt-1 truncate text-sm text-gray-500">
                                        {presupuesto.clientName || "Sin cliente"} ·{" "}
                                        {presupuesto.companyName || "Sin empresa"}
                                    </p>
                                </div>

                                <div className="shrink-0 md:text-right">
                                    <p className="font-bold text-[#111111]">
                                        {formatCurrency(presupuesto.total)}
                                    </p>

                                    <p className="text-xs text-gray-500">
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

function UsageProgress({ title, used, max, percentage, icon: Icon }) {
    const unlimited = isUnlimited(max, percentage);
    const safePercentage = clampPercentage(percentage);

    return (
        <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate font-semibold text-[#111111]">
                            {title}
                        </h3>

                        {unlimited ? (
                            <p className="text-sm text-gray-500">Uso ilimitado</p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                {formatPercent(safePercentage)} usado
                            </p>
                        )}
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    {unlimited ? (
                        <p className="font-bold text-[#111111]">Ilimitado</p>
                    ) : (
                        <p className="font-bold text-[#111111]">
                            {used} / {max}
                        </p>
                    )}
                </div>
            </div>

            {!unlimited && (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-red-500 transition-all duration-500"
                        style={{ width: `${safePercentage}%` }}
                    />
                </div>
            )}
        </div>
    );
}

UsageProgress.propTypes = {
    title: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    percentage: PropTypes.number,
    icon: PropTypes.elementType.isRequired,
};

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

function PlanUsageContent({ plan, usage, onNavigate }) {
    return (
        <section>
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <Gauge className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-[#111111]">
                            Uso del plan
                        </h2>

                        <p className="truncate text-sm text-gray-500">
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

function ToggleSideContent({ plan, usage, metrics, onNavigate }) {
    const hasHighlightedBudget =
        metrics.highestBudgetTotal !== null &&
        metrics.highestBudgetTotal !== undefined;

    const [activeView, setActiveView] = useState(
        hasHighlightedBudget ? "highlight" : "usage"
    );

    return (
        <aside className="border-t border-gray-100 p-5 xl:border-l xl:border-t-0">
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
                <button
                    type="button"
                    onClick={() => setActiveView("highlight")}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                        activeView === "highlight"
                            ? "bg-white text-[#111111] shadow-sm"
                            : "text-gray-500 hover:text-[#111111]"
                    }`}
                >
                    Destacado
                </button>

                <button
                    type="button"
                    onClick={() => setActiveView("usage")}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                        activeView === "usage"
                            ? "bg-white text-[#111111] shadow-sm"
                            : "text-gray-500 hover:text-[#111111]"
                    }`}
                >
                    Plan
                </button>
            </div>

            {activeView === "highlight" ? (
                <HighlightContent metrics={metrics} />
            ) : (
                <PlanUsageContent
                    plan={plan}
                    usage={usage}
                    onNavigate={onNavigate}
                />
            )}
        </aside>
    );
}

ToggleSideContent.propTypes = {
    plan: PropTypes.object.isRequired,
    usage: PropTypes.object.isRequired,
    metrics: PropTypes.object.isRequired,
    onNavigate: PropTypes.func.isRequired,
};

function DashboardContentBlock({
    recentPresupuestos,
    plan,
    usage,
    metrics,
    onboarding,
    onNavigate,
}) {
    return (
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid items-start xl:grid-cols-[1.3fr_0.7fr]">
                <RecentPresupuestosContent
                    presupuestos={recentPresupuestos || []}
                    onboarding={onboarding}
                    onNavigate={onNavigate}
                />

                <ToggleSideContent
                    plan={plan}
                    usage={usage}
                    metrics={metrics}
                    onNavigate={onNavigate}
                />
            </div>
        </section>
    );
}

DashboardContentBlock.propTypes = {
    recentPresupuestos: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    usage: PropTypes.object.isRequired,
    metrics: PropTypes.object.isRequired,
    onboarding: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
};

function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboardSummary();

                setSummary(data);
            } catch (err) {
                setError(
                    err.message ||
                        "No pudimos cargar la información del Dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleNavigate = (url) => {
        if (!url) return;

        navigate(url);
    };

    if (loading) {
        return <DashboardLoading />;
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                <h2 className="text-lg font-bold">
                    No pudimos cargar el Dashboard
                </h2>

                <p className="mt-1 text-sm">{error}</p>

                <Button
                    type="button"
                    className="mt-4 bg-red-500 hover:bg-red-600"
                    onClick={() => globalThis.location.reload()}
                >
                    Reintentar
                </Button>
            </div>
        );
    }

    if (!summary) return null;

    const { plan, usage, metrics, onboarding, recentPresupuestos } = summary;

    return (
        <div className="space-y-5 pb-5">
            <DashboardTopPanel
                user={user}
                summary={summary}
                onNavigate={handleNavigate}
            />

            <DashboardContentBlock
                recentPresupuestos={recentPresupuestos || []}
                plan={plan}
                usage={usage}
                metrics={metrics}
                onboarding={onboarding}
                onNavigate={handleNavigate}
            />
        </div>
    );
}

export default DashboardPage;