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

export function parseRichTextHtml(html) {
    if (!html) return [];

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    const blocks = [];

    const parseInlineNodes = (nodes, activeStyles = {}) => {
        const segments = [];

        nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent
                    .replaceAll("\u00A0", " ")
                    .replaceAll("&nbsp;", " ");

                if (text) {
                    segments.push({
                        text,
                        bold: Boolean(activeStyles.bold),
                        underline: Boolean(activeStyles.underline),
                    });
                }

                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const tagName = node.tagName.toLowerCase();

            if (tagName === "br") {
                segments.push({
                    text: "\n",
                    bold: Boolean(activeStyles.bold),
                    underline: Boolean(activeStyles.underline),
                });

                return;
            }

            const nextStyles = {
                ...activeStyles,
                bold:
                    activeStyles.bold ||
                    tagName === "strong" ||
                    tagName === "b",
                underline:
                    activeStyles.underline ||
                    tagName === "u",
            };

            segments.push(
                ...parseInlineNodes(
                    Array.from(node.childNodes),
                    nextStyles
                )
            );
        });

        return segments;
    };

    const addParagraph = (element) => {
        const segments = parseInlineNodes(Array.from(element.childNodes));

        const hasContent = segments.some((segment) =>
            segment.text.trim()
        );

        if (!hasContent) {
            blocks.push({
                type: "empty",
                segments: [],
            });

            return;
        }

        blocks.push({
            type: "paragraph",
            segments,
        });
    };

    Array.from(document.body.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();

            if (text) {
                blocks.push({
                    type: "paragraph",
                    segments: [
                        {
                            text,
                            bold: false,
                            underline: false,
                        },
                    ],
                });
            }

            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const tagName = node.tagName.toLowerCase();

        if (tagName === "p") {
            addParagraph(node);
            return;
        }

        if (tagName === "ul" || tagName === "ol") {
            const listItems = Array.from(node.children).filter(
                (child) => child.tagName.toLowerCase() === "li"
            );

            listItems.forEach((item, index) => {
                const segments = parseInlineNodes(
                    Array.from(item.childNodes)
                );

                blocks.push({
                    type: tagName === "ul" ? "bullet" : "ordered",
                    number: index + 1,
                    segments,
                });
            });

            return;
        }

        addParagraph(node);
    });

    return blocks;
}