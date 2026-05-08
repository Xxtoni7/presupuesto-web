const INTER_FONTS = [
    {
        path: "/fonts/inter/Inter-Regular.ttf",
        fileName: "Inter-Regular.ttf",
        fontName: "Inter",
        fontStyle: "normal",
    },
    {
        path: "/fonts/inter/Inter-Medium.ttf",
        fileName: "Inter-Medium.ttf",
        fontName: "Inter",
        fontStyle: "medium",
    },
    {
        path: "/fonts/inter/Inter-SemiBold.ttf",
        fileName: "Inter-SemiBold.ttf",
        fontName: "Inter",
        fontStyle: "semibold",
    },
    {
        path: "/fonts/inter/Inter-Bold.ttf",
        fileName: "Inter-Bold.ttf",
        fontName: "Inter",
        fontStyle: "bold",
    },
];

let cachedFonts = null;

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let index = 0; index < bytes.byteLength; index += 1) {
        binary += String.fromCodePoint(bytes[index]);
    }

    return btoa(binary);
}

async function loadFontAsBase64(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`No se pudo cargar la fuente: ${path}`);
    }

    const buffer = await response.arrayBuffer();

    return arrayBufferToBase64(buffer);
}

async function getCachedFonts() {
    if (cachedFonts) return cachedFonts;

    cachedFonts = await Promise.all(
        INTER_FONTS.map(async (font) => ({
            ...font,
            base64: await loadFontAsBase64(font.path),
        }))
    );

    return cachedFonts;
}

export async function registerInterFonts(doc) {
    const fonts = await getCachedFonts();

    for (const font of fonts) {
        doc.addFileToVFS(font.fileName, font.base64);
        doc.addFont(font.fileName, font.fontName, font.fontStyle);
    }

    doc.setFont("Inter", "normal");
}