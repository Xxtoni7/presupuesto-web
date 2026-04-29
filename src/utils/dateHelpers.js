export function getTodayDateInputValue() {
    return new Date().toISOString().split("T")[0];
}

export function toDateInputValue(dateValue) {
    if (!dateValue) return "";

    return new Date(dateValue).toISOString().split("T")[0];
}