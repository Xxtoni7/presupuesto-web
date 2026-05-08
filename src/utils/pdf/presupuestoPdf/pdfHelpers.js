import { API_BASE_URL } from "../../constants";

export function hexToRgb(hex, fallback = [239, 68, 68]) {
    if (!hex) return fallback;

    const cleanHex = hex.replace("#", "");

    if (cleanHex.length !== 6) return fallback;

    return [
        Number.parseInt(cleanHex.substring(0, 2), 16),
        Number.parseInt(cleanHex.substring(2, 4), 16),
        Number.parseInt(cleanHex.substring(4, 6), 16),
    ];
}

export function safeText(value, fallback = "-") {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    return String(value);
}

export function sanitizeFileName(value) {
    return safeText(value, "presupuesto")
        .replaceAll(/[\\/:*?"<>|]/g, "")
        .replaceAll(/\s+/g, "_");
}

export function getImageUrl(logoUrl) {
    if (!logoUrl) return null;

    if (logoUrl.startsWith("http")) return logoUrl;

    return `${API_BASE_URL}${logoUrl}`;
}

export function loadImageElement(url) {
    if (!url) return Promise.resolve(null);

    return new Promise((resolve) => {
        const image = new Image();

        image.crossOrigin = "anonymous";

        image.onload = () => resolve(image);

        image.onerror = () => resolve(null);

        image.src = url;
    });
}

export function formatPdfDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export async function loadSvgAsPngDataUrl(path, size = 24) {
    try {
        const response = await fetch(path);

        if (!response.ok) return null;

        const svgText = await response.text();
        const svgBlob = new Blob([svgText], {
            type: "image/svg+xml;charset=utf-8",
        });

        const svgUrl = URL.createObjectURL(svgBlob);

        const image = await new Promise((resolve) => {
            const img = new Image();

            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = svgUrl;
        });

        URL.revokeObjectURL(svgUrl);

        if (!image) return null;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");

        if (!context) return null;

        context.clearRect(0, 0, size, size);
        context.drawImage(image, 0, 0, size, size);

        return canvas.toDataURL("image/png");
    } catch {
        return null;
    }
}