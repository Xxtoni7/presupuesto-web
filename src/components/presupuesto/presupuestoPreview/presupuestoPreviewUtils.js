import DOMPurify from "dompurify";

export const PDF_LAYOUT = {
    pageWidthMm: 210,
    contentWidthMm: 170,
    footerReservedSpaceMm: 24,
    mainGapAfterHeaderMm: 9,
    paginationBaselineOffsetMm: 5,
    sectionGapMm: 10,
    richLineHeightMm: 6.2,
    richBlockGapMm: 2,
    richBlockExtraMm: 4,
    jobStartReserveMm: 16,
    observationsStartReserveMm: 8 + 6.2,
    tableAfterGapMm: 0,
    timeTitleHeightMm: 8,
    timeLineHeightMm: 6,
    timeExtraMm: 4,
};

export const PDF_HEADER_LAYOUT = {
    heightMm: 36,
    logoBoxY: 2,
    logoBoxHeight: 27,
    logoMinWidth: 30,
    logoMaxWidth: 42,
    logoDefaultWidth: 32,
    logoPadding: 0.8,
    companyNameY: 11,
    companyNameLineHeight: 5.28,
    companyInfoY: 19,
    companyInfoTwoLineOffset: 5,
    companyInfoLineGap: 5.5,
    companyInfoLineHeight: 4.8,
    companyTextLogoGap: 6,
    infoTextOffset: 6.5,
    rightSectionWidth: 72,
    emailExtraWidth: 15,
    titleY: 10,
    budgetNumberY: 18,
    dateY: 25.8,
    dividerY: 36,
};

export const PDF_FOOTER_LAYOUT = {
    heightMm: 20,
    textY: 7,
    accentWidthMm: 18,
    baseLineWidthMm: 0.25,
    accentLineWidthMm: 0.7,
    fontSizePt: 9.3,
    labelDateGapMm: 2.5,
    companyNameMaxWidthMm: 75,
};

export const PDF_TABLE_LAYOUT = {
    titleHeightMm: 7,
    titleFontSizePt: 13,
    lineHeightFactor: 1.15,
    radiusMm: 3,
    borderWidthMm: 0.25,
    bodyDividerWidthMm: 0.25,
    footerDividerWidthMm: 0.6,
    cellPaddingMm: 4,
    headerVerticalPaddingMm: 4.5,
    headerFontSizePt: 8.5,
    descriptionFontSizePt: 11,
    valueFontSizePt: 9.5,
    totalLabelFontSizePt: 10,
    totalFontSizePt: 18,
    footerHeightMm: 20,
};

const CSS_PIXELS_PER_MILLIMETER = 96 / 25.4;

export function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function normalizeRichTextHtml(html) {
    if (!html) return "";

    return html
        .replaceAll("&nbsp;", " ")
        .replaceAll("\u00A0", " ")
        .replaceAll("\t", "    ");
}

export function applyOrderedListStartValues(html) {
    if (!html) return "";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    let nextOrderedNumber = 1;

    Array.from(wrapper.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();

        if (tagName === "ol") {
            element.setAttribute("start", String(nextOrderedNumber));

            const directItems = Array.from(element.children).filter(
                (child) => child.tagName.toLowerCase() === "li",
            );

            nextOrderedNumber += directItems.length;
            return;
        }

        if (tagName === "ul") {
            return;
        }

        nextOrderedNumber = 1;
    });

    return wrapper.innerHTML;
}

export function hasText(value) {
    return Boolean(value?.trim());
}

export function hasRichTextContent(html) {
    if (!html) return false;

    const normalizedHtml = normalizeRichTextHtml(html);
    const plainText = DOMPurify.sanitize(normalizedHtml, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });

    return Boolean(plainText.trim());
}

export function pointsToMillimeters(points) {
    return (points * 25.4) / 72;
}

export function getRichTextBlocks(html, prefix) {
    if (!html) return [];

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const blocks = [];

    Array.from(wrapper.childNodes).forEach((node, nodeIndex) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.trim()) {
                const textWrapper = document.createElement("span");
                textWrapper.textContent = node.textContent;

                blocks.push({
                    id: `${prefix}-text-${nodeIndex}`,
                    type: "paragraph",
                    html: textWrapper.innerHTML,
                });
            }

            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const tagName = node.tagName.toLowerCase();

        if (tagName === "ul" || tagName === "ol") {
            const listItems = Array.from(node.children).filter(
                (child) => child.tagName.toLowerCase() === "li",
            );
            const start =
                Number.parseInt(node.getAttribute("start"), 10) || 1;

            listItems.forEach((item, itemIndex) => {
                blocks.push({
                    id: `${prefix}-${tagName}-${nodeIndex}-${itemIndex}`,
                    type: tagName === "ol" ? "ordered" : "bullet",
                    number:
                        tagName === "ol"
                            ? start + itemIndex
                            : undefined,
                    html: item.innerHTML,
                });
            });

            return;
        }

        blocks.push({
            id: `${prefix}-${tagName}-${nodeIndex}`,
            type: "paragraph",
            html:
                tagName === "p"
                    ? node.innerHTML
                    : node.outerHTML,
        });
    });

    return blocks;
}

export function wrapPlainText(text, maxWidth, font) {
    if (!text) return [];

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        return String(text)
            .replaceAll("\r\n", "\n")
            .replaceAll("\r", "\n")
            .split("\n");
    }

    context.font = font;

    const lines = [];
    const paragraphs = String(text)
        .replaceAll("\r\n", "\n")
        .replaceAll("\r", "\n")
        .split("\n");

    const pushLongToken = (token, currentLine) => {
        let line = currentLine;
        const characters = Array.from(token);

        while (characters.length > 0) {
            let lower = 1;
            let upper = characters.length;
            let fittingCount = 0;

            while (lower <= upper) {
                const middle = Math.floor((lower + upper) / 2);
                const candidate =
                    line + characters.slice(0, middle).join("");

                if (context.measureText(candidate).width <= maxWidth) {
                    fittingCount = middle;
                    lower = middle + 1;
                } else {
                    upper = middle - 1;
                }
            }

            if (fittingCount === 0 && line) {
                lines.push(line);
                line = "";
                continue;
            }

            if (fittingCount === 0) {
                fittingCount = 1;
            }

            line += characters.splice(0, fittingCount).join("");

            if (characters.length > 0) {
                lines.push(line);
                line = "";
            }
        }

        return line;
    };

    paragraphs.forEach((paragraph) => {
        if (paragraph === "") {
            lines.push("");
            return;
        }

        const parts = paragraph.split(/(\s+)/);
        let currentLine = "";

        parts.forEach((part) => {
            if (!part) return;

            const candidate = currentLine + part;

            if (context.measureText(candidate).width <= maxWidth) {
                currentLine = candidate;
                return;
            }

            if (part.trim() === "") return;

            if (
                currentLine &&
                context.measureText(part).width <= maxWidth
            ) {
                lines.push(currentLine.trimEnd());
                currentLine = part.trimStart();
                return;
            }

            currentLine = pushLongToken(part, currentLine);
        });

        lines.push(currentLine.trimEnd());
    });

    return lines;
}

export function getPreviewLogoBoxSize(imageSize) {
    if (!imageSize?.width || !imageSize?.height) {
        return {
            width: PDF_HEADER_LAYOUT.logoDefaultWidth,
            height: PDF_HEADER_LAYOUT.logoBoxHeight,
        };
    }

    const ratio = imageSize.width / imageSize.height;
    const calculatedWidth =
        PDF_HEADER_LAYOUT.logoBoxHeight * ratio;

    return {
        width: Math.min(
            Math.max(
                calculatedWidth,
                PDF_HEADER_LAYOUT.logoMinWidth,
            ),
            PDF_HEADER_LAYOUT.logoMaxWidth,
        ),
        height: PDF_HEADER_LAYOUT.logoBoxHeight,
    };
}

export function getPreviewTextLines(
    text,
    maxWidthMm,
    font,
    maxLines,
) {
    return wrapPlainText(
        text,
        maxWidthMm * CSS_PIXELS_PER_MILLIMETER,
        font,
    ).slice(0, maxLines);
}

export function getPreviewTextWidthMm(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return 0;

    context.font = font;

    return (
        context.measureText(text).width /
        CSS_PIXELS_PER_MILLIMETER
    );
}

export function getPreviewTableHeaderColor(hex) {
    const cleanHex = hex?.replace("#", "") ?? "";

    if (cleanHex.length !== 6) {
        return "rgb(51, 51, 51)";
    }

    const channels = [0, 2, 4].map((start) =>
        Number.parseInt(cleanHex.substring(start, start + 2), 16),
    );

    if (channels.some(Number.isNaN)) {
        return "rgb(51, 51, 51)";
    }

    const blendedChannels = channels.map((channel) =>
        Math.round(channel * 0.8 + 255 * 0.2),
    );

    return `rgb(${blendedChannels.join(", ")})`;
}

export function isLightColor(hex) {
    if (!hex) return false;

    const color = hex.replace("#", "");

    if (color.length !== 6) return false;

    const r = Number.parseInt(color.substring(0, 2), 16);
    const g = Number.parseInt(color.substring(2, 4), 16);
    const b = Number.parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155;
}
