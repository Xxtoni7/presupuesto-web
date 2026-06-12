export function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export function formatPercent(value) {
    if (value === null || value === undefined) return null;

    return `${Math.round(Number(value))}%`;
}

export function clampPercentage(value) {
    if (value === null || value === undefined) return null;

    return Math.min(Math.max(Number(value), 0), 100);
}

export function isUnlimited(max, percentage) {
    return max === -1 || percentage === null || percentage === undefined;
}

export function getUserLabel(user) {
    if (!user?.email) return "bienvenido";

    return user.email.split("@")[0];
}