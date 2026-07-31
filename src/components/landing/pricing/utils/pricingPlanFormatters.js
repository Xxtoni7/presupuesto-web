export const CURRENCY_FORMATTER = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
});

export function isUnlimited(value) {
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

export function formatNumber(value) {
    return new Intl.NumberFormat("es-AR").format(Number(value));
}

export function formatPrice(price) {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice === 0) {
        return "$0";
    }

    return CURRENCY_FORMATTER.format(numericPrice);
}

export function getPdfPeriodLabel(period) {
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

export function getPdfDescription(plan) {
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
