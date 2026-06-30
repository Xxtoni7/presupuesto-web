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
    return [
        `${formatLimit(plan.maxCompanies)} ${plan.maxCompanies === 1 ? "empresa" : "empresas"}`,
        `${formatLimit(plan.maxPresupuestos)} ${
            plan.maxPresupuestos === 1 ? "presupuesto" : "presupuestos"
        }`,
        `${formatLimit(plan.maxPdfExports)} exportaciones PDF`,
    ];
}
