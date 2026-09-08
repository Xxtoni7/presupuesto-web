export function formatLimit(value) {
    return value === -1 ? "Ilimitado" : value;
}

export function formatPrice(value) {
    if (value === 0) return "$0";

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

export function getUsageLabel(used, max) {
    if (max === -1) return `Ilimitado`;

    return `${used} / ${max}`;
}

export function getPlanFeatures(plan) {
    const maxPresupuestosLabel = plan.maxPresupuestos === 1 ? "presupuesto" : "presupuestos";
    const maxCompaniesLabel = plan.maxCompanies === 1 ? "empresa" : "empresas";

    return [
        plan.maxCompanies === -1 ? "Empresas ilimitadas" : `${formatLimit(plan.maxCompanies)} ${maxCompaniesLabel}`,
        plan.maxPresupuestos === -1 ? "Presupuestos ilimitados" : `${formatLimit(plan.maxPresupuestos)} ${maxPresupuestosLabel}`,
        plan.maxPdfExports === -1 ? "Exportaciones PDF ilimitadas" : `${formatLimit(plan.maxPdfExports)} exportaciones PDF`,
    ];
}
