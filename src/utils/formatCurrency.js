export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || Number.isNaN(amount)) {
        return "$0,00";
    }

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const parseCurrency = (value) => {
    if (!value) return 0;

    const cleaned = value.toString().replaceAll(/[^0-9.-]/g, "");
    return Number.parseFloat(cleaned) || 0;
};