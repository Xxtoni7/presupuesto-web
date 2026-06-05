import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Building2, CheckCircle, Crown, Download, FileText, Mail, MonitorCog, Sparkles, User } from "lucide-react";
import { getAvailablePlans, getCurrentPlan } from "../api/planApi";
import { useAuth } from "../context/AuthContext";

function formatLimit(value) {
    return value === -1 ? "Ilimitado" : value;
}

function formatPrice(value) {
    if (value === 0) return "$0";

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

function getUsageLabel(used, max) {
    if (max === -1) return `${used} / Ilimitado`;

    return `${used} / ${max}`;
}

function getPlanFeatures(plan) {
    return [
        `${formatLimit(plan.maxCompanies)} ${plan.maxCompanies === 1 ? "empresa" : "empresas"}`,
        `${formatLimit(plan.maxPresupuestos)} ${
            plan.maxPresupuestos === 1 ? "presupuesto" : "presupuestos"
        }`,
        `${formatLimit(plan.maxPdfExports)} exportaciones PDF`,
    ];
}

function PlanOptionCard({ plan, isCurrent }) {
    const isPopular = plan.name === "Pro";

    return (
        <article
            className={`relative rounded-2xl border bg-white transition ${
                isCurrent
                    ? "border-red-200 shadow-lg ring-2 ring-red-100"
                    : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
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
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#111111]">
                            {plan.name}
                        </h3>
                        <p className="mt-1 text-sm leading-5 text-gray-600">
                            {plan.description}
                        </p>
                    </div>

                    {isCurrent && (
                        <span className="ml-2 shrink-0 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                            Actual
                        </span>
                    )}
                </div>

                <div className="mb-6 border-y border-gray-100 py-6">
                    <p className="text-4xl font-bold text-[#111111]">
                        {formatPrice(plan.price)}
                        {plan.price > 0 && (
                            <span className="text-lg font-semibold text-gray-600">
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
                            className="flex items-start gap-3 text-sm text-gray-700"
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
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border border-gray-300 bg-white text-gray-400 hover:bg-gray-50"
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
};

function SettingsPage() {
    const { user } = useAuth();

    const [currentPlan, setCurrentPlan] = useState(null);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSettingsData = async () => {
            try {
                setLoading(true);
                setError("");

                const [currentPlanData, availablePlansData] = await Promise.all([
                    getCurrentPlan(),
                    getAvailablePlans(),
                ]);

                setCurrentPlan(currentPlanData);
                setAvailablePlans(availablePlansData);
            } catch (err) {
                setError(err.message || "No se pudo cargar la configuracion.");
            } finally {
                setLoading(false);
            }
        };

        loadSettingsData();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500">
                    Cargando configuracion...
                </p>
            </div>
        );
    }

    const currentPlanName = currentPlan?.planName || user?.planName || "Free";

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#111111]">
                    Configuración
                </h1>
                <p className="mt-2 text-base text-gray-600">
                    Administra tu cuenta, plan de suscripción y preferencias
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-3">
                        <div className="flex items-center gap-4 pb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-[#111111]">
                                    Perfil
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Información de tu cuenta
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex flex-col gap-6 sm:flex-row">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">
                                        Email
                                    </p>
                                    <p className="mt-2 flex items-center gap-2 break-all text-base font-semibold text-[#111111]">
                                        <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                                        {user?.email || "Sin email disponible"}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">
                                        Plan actual
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-red-500">
                                        Plan {currentPlanName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-8 shadow-sm">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <Crown className="h-6 w-6 text-red-500" />
                            </div>
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-500 shadow-sm">
                                Actual
                            </span>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Tu suscripción
                            </p>
                            <h2 className="mt-2 text-5xl font-bold text-[#111111]">
                                {currentPlanName}
                            </h2>
                        </div>

                        <p className="mt-6 text-sm leading-6 text-gray-600">
                            Tu cuenta está usando el plan <span className="font-semibold text-[#111111]">{currentPlanName}</span>. Podrás mejorar tu plan cuando activemos los pagos.
                        </p>
                    </div>

                    {currentPlan && (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[#111111]">
                                    Uso disponible
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Recursos de tu plan
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-5 w-5 text-red-500" />
                                        <span className="text-sm font-medium text-[#111111]">
                                            Empresas
                                        </span>
                                    </div>
                                    <span className="font-semibold text-[#111111]">
                                        {getUsageLabel(
                                            currentPlan.companiesUsed,
                                            currentPlan.maxCompanies
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-red-500" />
                                        <span className="text-sm font-medium text-[#111111]">
                                            Presupuestos
                                        </span>
                                    </div>
                                    <span className="font-semibold text-[#111111]">
                                        {getUsageLabel(
                                            currentPlan.presupuestosUsed,
                                            currentPlan.maxPresupuestos
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Download className="h-5 w-5 text-red-500" />
                                        <span className="text-sm font-medium text-[#111111]">
                                            Exportaciones PDF
                                        </span>
                                    </div>
                                    <span className="font-semibold text-[#111111]">
                                        {getUsageLabel(
                                            currentPlan.pdfExportsUsed,
                                            currentPlan.maxPdfExports
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section>
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                                <Sparkles className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-[#111111]">
                                    Planes disponibles
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Compara todas las opciones y elige el que mejor se adapte a ti
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {availablePlans.map((plan) => (
                            <PlanOptionCard
                                key={plan.idPlan}
                                plan={plan}
                                isCurrent={plan.name === currentPlanName}
                            />
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                                    <MonitorCog className="h-5 w-5 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#111111]">
                                    Apariencia
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500">
                                Personaliza la apariencia de la aplicación
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:text-right">
                            <p className="font-medium text-gray-600">
                                Modo oscuro
                            </p>
                            <button
                                type="button"
                                disabled
                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 sm:justify-end"
                            >
                                Proximamente
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SettingsPage;
