import { useLayoutEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { MapPin, User } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function normalizeRichTextHtml(html) {
    if (!html) return "";

    return html
        .replaceAll("&nbsp;", " ")
        .replaceAll("\u00A0", " ")
        .replaceAll("\t", "    ");
}

function applyOrderedListStartValues(html) {
    if (!html) return "";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    let nextOrderedNumber = 1;

    Array.from(wrapper.children).forEach((element) => {
        const tagName = element.tagName.toLowerCase();

        if (tagName === "ol") {
            element.setAttribute("start", String(nextOrderedNumber));

            const directItems = Array.from(element.children).filter(
                (child) => child.tagName.toLowerCase() === "li"
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

function hasText(value) {
    return Boolean(value?.trim());
}

function hasRichTextContent(html) {
    if (!html) return false;

    const normalizedHtml = normalizeRichTextHtml(html);

    const plainText = DOMPurify.sanitize(normalizedHtml, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });

    return Boolean(plainText.trim());
}

const PDF_LAYOUT = {
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
    tableAfterGapMm: 10,
    timeTitleHeightMm: 8,
    timeLineHeightMm: 6,
    timeExtraMm: 4,
};

const PDF_HEADER_LAYOUT = {
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

const PDF_FOOTER_LAYOUT = {
    heightMm: 20,
    textY: 7,
    accentWidthMm: 18,
    baseLineWidthMm: 0.25,
    accentLineWidthMm: 0.7,
    fontSizePt: 9.3,
    labelDateGapMm: 2.5,
    companyNameMaxWidthMm: 75,
};

const PDF_TABLE_LAYOUT = {
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

function pointsToMillimeters(points) {
    return (points * 25.4) / 72;
}

function getRichTextBlocks(html, prefix) {
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

function wrapPlainText(text, maxWidth, font) {
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

function getPreviewLogoBoxSize(imageSize) {
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

function getPreviewTextLines(text, maxWidthMm, font, maxLines) {
    return wrapPlainText(
        text,
        maxWidthMm * CSS_PIXELS_PER_MILLIMETER,
        font,
    ).slice(0, maxLines);
}

function getPreviewTextWidthMm(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return 0;

    context.font = font;

    return (
        context.measureText(text).width /
        CSS_PIXELS_PER_MILLIMETER
    );
}

function getPreviewTableHeaderColor(hex) {
    const cleanHex = hex?.replace("#", "");

    if (!cleanHex || cleanHex.length !== 6) {
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

function PreviewHeader({
    company,
    presupuesto,
    primaryColor,
    logoSrc,
    logoImageSize,
    headerRef,
}) {
    const logoBoxSize =
        logoSrc && logoImageSize
            ? getPreviewLogoBoxSize(logoImageSize)
            : null;
    const companyTextX = logoBoxSize
        ? logoBoxSize.width +
          PDF_HEADER_LAYOUT.companyTextLogoGap
        : 0;
    const companyName = company?.name || "Empresa";
    const companyNameMaxWidth =
        PDF_LAYOUT.contentWidthMm -
        companyTextX -
        PDF_HEADER_LAYOUT.rightSectionWidth;
    const companyNameLines = getPreviewTextLines(
        companyName,
        companyNameMaxWidth,
        "600 13pt Inter, sans-serif",
        2,
    );
    const companyInfoY =
        PDF_HEADER_LAYOUT.companyInfoY +
        (companyNameLines.length > 1
            ? PDF_HEADER_LAYOUT.companyInfoTwoLineOffset
            : 0);
    const infoTextX =
        companyTextX + PDF_HEADER_LAYOUT.infoTextOffset;
    const companyInfoMaxWidth =
        PDF_LAYOUT.contentWidthMm -
        PDF_HEADER_LAYOUT.rightSectionWidth -
        infoTextX +
        PDF_HEADER_LAYOUT.emailExtraWidth;
    const emailLines = company?.email
        ? getPreviewTextLines(
              company.email,
              companyInfoMaxWidth,
              "400 10pt Inter, sans-serif",
              2,
          )
        : [];
    const emailY =
        companyInfoY +
        (company?.phone
            ? PDF_HEADER_LAYOUT.companyInfoLineGap
            : 0);
    const dateText = formatDate(
        presupuesto?.fechaPresupuesto,
    );
    const dateTextWidth = getPreviewTextWidthMm(
        dateText,
        "400 10pt Inter, sans-serif",
    );
    const calendarIconX =
        PDF_LAYOUT.contentWidthMm -
        dateTextWidth -
        3.8 -
        3 +
        1.2;

    return (
        <header
            ref={headerRef}
            className="shrink-0"
            style={{
                height: `${PDF_HEADER_LAYOUT.heightMm}mm`,
            }}
        >
            <svg
                viewBox={`0 0 ${PDF_LAYOUT.contentWidthMm} ${PDF_HEADER_LAYOUT.heightMm}`}
                className="block h-full w-full overflow-visible"
                role="img"
                aria-label={`Encabezado del presupuesto ${presupuesto?.budgetNumber || "-"}`}
            >
                {logoBoxSize && (
                    <>
                        <rect
                            x="0"
                            y={PDF_HEADER_LAYOUT.logoBoxY}
                            width={logoBoxSize.width}
                            height={logoBoxSize.height}
                            rx="2.5"
                            fill="#ffffff"
                            stroke="#e5e7eb"
                            strokeWidth="0.4"
                        />

                        <image
                            href={logoSrc}
                            x={PDF_HEADER_LAYOUT.logoPadding}
                            y={
                                PDF_HEADER_LAYOUT.logoBoxY +
                                PDF_HEADER_LAYOUT.logoPadding
                            }
                            width={
                                logoBoxSize.width -
                                PDF_HEADER_LAYOUT.logoPadding * 2
                            }
                            height={
                                logoBoxSize.height -
                                PDF_HEADER_LAYOUT.logoPadding * 2
                            }
                            preserveAspectRatio="xMidYMid meet"
                        />
                    </>
                )}

                <text
                    x={companyTextX}
                    y={PDF_HEADER_LAYOUT.companyNameY}
                    fill="#111827"
                    fontFamily="Inter, sans-serif"
                    fontSize={pointsToMillimeters(13)}
                    fontWeight="600"
                >
                    {companyNameLines.map((line, index) => (
                        <tspan
                            key={`${line}-${index}`}
                            x={companyTextX}
                            dy={
                                index === 0
                                    ? 0
                                    : PDF_HEADER_LAYOUT.companyNameLineHeight
                            }
                        >
                            {line}
                        </tspan>
                    ))}
                </text>

                {company?.phone && (
                    <>
                        <image
                            href="/icons/pdf/phone.svg"
                            x={companyTextX}
                            y={companyInfoY - 3.4}
                            width="3.6"
                            height="3.6"
                        />

                        <text
                            x={infoTextX}
                            y={companyInfoY}
                            fill="#6b7280"
                            fontFamily="Inter, sans-serif"
                            fontSize={pointsToMillimeters(10)}
                            fontWeight="400"
                        >
                            {company.phone}
                        </text>
                    </>
                )}

                {company?.email && (
                    <>
                        <image
                            href="/icons/pdf/mail.svg"
                            x={companyTextX + 0.2}
                            y={emailY - 2.8}
                            width="3.4"
                            height="3.4"
                        />

                        <text
                            x={infoTextX}
                            y={emailY}
                            fill="#6b7280"
                            fontFamily="Inter, sans-serif"
                            fontSize={pointsToMillimeters(10)}
                            fontWeight="400"
                        >
                            {emailLines.map((line, index) => (
                                <tspan
                                    key={`${line}-${index}`}
                                    x={infoTextX}
                                    dy={
                                        index === 0
                                            ? 0
                                            : PDF_HEADER_LAYOUT.companyInfoLineHeight
                                    }
                                >
                                    {line}
                                </tspan>
                            ))}
                        </text>
                    </>
                )}

                <text
                    x={PDF_LAYOUT.contentWidthMm}
                    y={PDF_HEADER_LAYOUT.titleY}
                    textAnchor="end"
                    fill={primaryColor}
                    fontFamily="Inter, sans-serif"
                    fontSize={pointsToMillimeters(20)}
                    fontWeight="700"
                >
                    PRESUPUESTO
                </text>

                <text
                    x={PDF_LAYOUT.contentWidthMm}
                    y={PDF_HEADER_LAYOUT.budgetNumberY}
                    textAnchor="end"
                    fill="#111827"
                    fontFamily="Inter, sans-serif"
                    fontSize={pointsToMillimeters(12.5)}
                    fontWeight="600"
                >
                    {presupuesto?.budgetNumber || "-"}
                </text>

                <image
                    href="/icons/pdf/calendar.svg"
                    x={calendarIconX}
                    y="22.6"
                    width="3.8"
                    height="3.8"
                />

                <text
                    x={PDF_LAYOUT.contentWidthMm}
                    y={PDF_HEADER_LAYOUT.dateY}
                    textAnchor="end"
                    fill="#6b7280"
                    fontFamily="Inter, sans-serif"
                    fontSize={pointsToMillimeters(10)}
                    fontWeight="400"
                >
                    {dateText}
                </text>

                <line
                    x1="0"
                    y1={PDF_HEADER_LAYOUT.dividerY}
                    x2={PDF_LAYOUT.contentWidthMm}
                    y2={PDF_HEADER_LAYOUT.dividerY}
                    stroke={primaryColor}
                    strokeWidth="0.6"
                />
            </svg>
        </header>
    );
}

function PreviewFooter({
    company,
    presupuesto,
    primaryColor,
    isLastPage,
}) {
    const fontSize = pointsToMillimeters(
        PDF_FOOTER_LAYOUT.fontSizePt,
    );

    if (isLastPage) {
        const labelText = "Presupuesto válido hasta:";
        const expirationDateText = formatDate(
            presupuesto?.fechaVencimiento,
        );
        const labelWidth = getPreviewTextWidthMm(
            labelText,
            `400 ${PDF_FOOTER_LAYOUT.fontSizePt}pt Inter, sans-serif`,
        );
        const dateWidth = getPreviewTextWidthMm(
            expirationDateText,
            `600 ${PDF_FOOTER_LAYOUT.fontSizePt}pt Inter, sans-serif`,
        );
        const totalTextWidth =
            labelWidth +
            PDF_FOOTER_LAYOUT.labelDateGapMm +
            dateWidth;
        const startX =
            PDF_LAYOUT.contentWidthMm / 2 -
            totalTextWidth / 2;

        return (
            <footer
                className="absolute"
                style={{
                    left: "20mm",
                    right: "20mm",
                    bottom: 0,
                    height: `${PDF_FOOTER_LAYOUT.heightMm}mm`,
                }}
            >
                <svg
                    viewBox={`0 0 ${PDF_LAYOUT.contentWidthMm} ${PDF_FOOTER_LAYOUT.heightMm}`}
                    className="block h-full w-full overflow-visible"
                    role="img"
                    aria-label={`${labelText} ${expirationDateText}`}
                >
                    <line
                        x1="0"
                        y1="0"
                        x2={PDF_LAYOUT.contentWidthMm}
                        y2="0"
                        stroke="#e5e7eb"
                        strokeWidth={
                            PDF_FOOTER_LAYOUT.baseLineWidthMm
                        }
                    />

                    <text
                        x={startX}
                        y={PDF_FOOTER_LAYOUT.textY}
                        fill="#6b7280"
                        fontFamily="Inter, sans-serif"
                        fontSize={fontSize}
                        fontWeight="400"
                    >
                        {labelText}
                    </text>

                    <text
                        x={
                            startX +
                            labelWidth +
                            PDF_FOOTER_LAYOUT.labelDateGapMm
                        }
                        y={PDF_FOOTER_LAYOUT.textY}
                        fill="#374151"
                        fontFamily="Inter, sans-serif"
                        fontSize={fontSize}
                        fontWeight="600"
                    >
                        {expirationDateText}
                    </text>
                </svg>
            </footer>
        );
    }

    const companyName = company?.name || "Empresa";
    const companyNameLine =
        getPreviewTextLines(
            companyName,
            PDF_FOOTER_LAYOUT.companyNameMaxWidthMm,
            `600 ${PDF_FOOTER_LAYOUT.fontSizePt}pt Inter, sans-serif`,
            1,
        )[0] || "";

    return (
        <footer
            className="absolute"
            style={{
                left: "20mm",
                right: "20mm",
                bottom: 0,
                height: `${PDF_FOOTER_LAYOUT.heightMm}mm`,
            }}
        >
            <svg
                viewBox={`0 0 ${PDF_LAYOUT.contentWidthMm} ${PDF_FOOTER_LAYOUT.heightMm}`}
                className="block h-full w-full overflow-visible"
                role="img"
                aria-label={`Presupuesto ${presupuesto?.budgetNumber || "-"}, ${companyNameLine}`}
            >
                <line
                    x1="0"
                    y1="0"
                    x2={PDF_LAYOUT.contentWidthMm}
                    y2="0"
                    stroke="#e5e7eb"
                    strokeWidth={
                        PDF_FOOTER_LAYOUT.baseLineWidthMm
                    }
                />

                <line
                    x1="0"
                    y1="0"
                    x2={PDF_FOOTER_LAYOUT.accentWidthMm}
                    y2="0"
                    stroke={primaryColor}
                    strokeWidth={
                        PDF_FOOTER_LAYOUT.accentLineWidthMm
                    }
                />

                <text
                    x="0"
                    y={PDF_FOOTER_LAYOUT.textY}
                    fill="#6b7280"
                    fontFamily="Inter, sans-serif"
                    fontSize={fontSize}
                    fontWeight="400"
                >
                    {`Presupuesto ${presupuesto?.budgetNumber || "-"}`}
                </text>

                <text
                    x={PDF_LAYOUT.contentWidthMm}
                    y={PDF_FOOTER_LAYOUT.textY}
                    textAnchor="end"
                    fill="#374151"
                    fontFamily="Inter, sans-serif"
                    fontSize={fontSize}
                    fontWeight="600"
                >
                    {companyNameLine}
                </text>
            </svg>
        </footer>
    );
}

function createEmptyPage() {
    return {
        elements: [],
    };
}

function buildPreviewPages({
    pageHeight,
    pixelsPerMillimeter,
    measurements,
    jobBlocks,
    observationBlocks,
    items,
    timeData,
}) {
    if (!pageHeight || !pixelsPerMillimeter) {
        return [createEmptyPage()];
    }

    const sectionGap =
        PDF_LAYOUT.sectionGapMm * pixelsPerMillimeter;
    const richMinimumReserve =
        (PDF_LAYOUT.richLineHeightMm +
            PDF_LAYOUT.richBlockExtraMm) *
        pixelsPerMillimeter;
    const richBlockGap =
        PDF_LAYOUT.richBlockGapMm * pixelsPerMillimeter;
    const pages = [createEmptyPage()];
    let pageIndex = 0;
    let usedHeight = 0;
    const richPageHeight = () =>
        pageHeight -
        (pageIndex > 0
            ? PDF_LAYOUT.paginationBaselineOffsetMm *
              pixelsPerMillimeter
            : 0);

    const currentPage = () => pages[pageIndex];

    const newPage = () => {
        pages.push(createEmptyPage());
        pageIndex += 1;
        usedHeight = 0;
    };

    const addElement = (element, height, gap = 0) => {
        if (
            usedHeight > 0 &&
            usedHeight + gap + height > pageHeight
        ) {
            newPage();
            gap = 0;
        }

        currentPage().elements.push({
            ...element,
            gap,
            height,
        });
        usedHeight += gap + height;
    };

    const addRichBlock = (block) => {
        const measurement = measurements.richBlocks[block.id];

        if (!measurement) return;

        const { lineCount, lineHeight } = measurement;
        let lineIndex = 0;

        while (lineIndex < lineCount) {
            const availableHeight =
                richPageHeight() - usedHeight;
            const neededHeight =
                lineIndex === 0
                    ? richMinimumReserve
                    : lineHeight;

            if (
                usedHeight > 0 &&
                availableHeight + 0.5 < neededHeight
            ) {
                newPage();
                continue;
            }

            let linesInSlice = Math.floor(
                (richPageHeight() - usedHeight + 0.5) /
                    lineHeight,
            );

            if (linesInSlice < 1) {
                if (usedHeight > 0) {
                    newPage();
                    continue;
                }

                linesInSlice = 1;
            }

            linesInSlice = Math.min(
                linesInSlice,
                lineCount - lineIndex,
            );

            const sliceOffset = lineIndex * lineHeight;
            const sliceHeight = linesInSlice * lineHeight;
            const isLastSlice =
                lineIndex + linesInSlice === lineCount;
            const afterGap = isLastSlice ? richBlockGap : 0;

            currentPage().elements.push({
                type: "richBlock",
                block,
                gap: 0,
                height: sliceHeight + afterGap,
                sliceOffset,
                sliceHeight,
                afterGap,
            });
            usedHeight += sliceHeight + afterGap;
            lineIndex += linesInSlice;

            if (lineIndex < lineCount) {
                newPage();
            }
        }
    };

    addElement(
        { type: "client" },
        measurements.clientHeight,
    );

    if (jobBlocks.length > 0) {
        let gap = sectionGap;
        const neededHeight = Math.max(
            PDF_LAYOUT.jobStartReserveMm *
                pixelsPerMillimeter,
            measurements.sectionTitleHeight +
                Math.min(
                    measurements.richBlocks[jobBlocks[0].id]
                        ?.height || 0,
                    richMinimumReserve,
                ),
        );

        if (
            usedHeight > 0 &&
            usedHeight + gap + neededHeight > pageHeight
        ) {
            newPage();
            gap = 0;
        }

        addElement(
            {
                type: "sectionTitle",
                text: "Descripción del trabajo:",
            },
            measurements.sectionTitleHeight,
            gap,
        );

        jobBlocks.forEach(addRichBlock);
    }

    const table = measurements.table;
    let tableGap = sectionGap;
    const completeTableHeight =
        table.titleHeight +
        table.frameExtra +
        table.headerHeight +
        table.rowHeights.reduce(
            (sum, height) => sum + height,
            0,
        ) +
        table.footerHeight;
    const canKeepCompleteTableTogether =
        completeTableHeight <= pageHeight;

    if (
        usedHeight > 0 &&
        canKeepCompleteTableTogether &&
        usedHeight + tableGap + completeTableHeight >
            pageHeight
    ) {
        newPage();
        tableGap = 0;
    }

    let rowIndex = 0;
    let firstTablePage = true;
    let totalPending = false;

    do {
        const titleHeight = firstTablePage
            ? table.titleHeight
            : 0;
        let segmentGap = firstTablePage ? tableGap : 0;
        const fixedHeight =
            titleHeight +
            table.frameExtra +
            table.headerHeight;

        if (
            usedHeight > 0 &&
            usedHeight + segmentGap + fixedHeight >
                pageHeight
        ) {
            newPage();
            segmentGap = 0;
        }

        const availableRowsHeight =
            pageHeight -
            usedHeight -
            segmentGap -
            fixedHeight;
        const rowIndexes = [];
        let rowsHeight = 0;
        let retryOnNewPage = false;

        if (!totalPending) {
            while (rowIndex < items.length) {
                const rowHeight = table.rowHeights[rowIndex];
                const isLastRow =
                    rowIndex === items.length - 1;
                const neededHeight =
                    rowHeight +
                    (isLastRow ? table.footerHeight : 0);

                if (
                    rowsHeight + neededHeight <=
                    availableRowsHeight + 0.5
                ) {
                    rowIndexes.push(rowIndex);
                    rowsHeight += rowHeight;
                    rowIndex += 1;
                    continue;
                }

                if (rowIndexes.length > 0) break;

                if (usedHeight > 0 || segmentGap > 0) {
                    newPage();
                    tableGap = 0;
                    retryOnNewPage = true;
                    break;
                }

                if (
                    rowHeight <=
                    availableRowsHeight + 0.5
                ) {
                    rowIndexes.push(rowIndex);
                    rowsHeight += rowHeight;
                    rowIndex += 1;
                    break;
                }

                rowIndexes.push(rowIndex);
                rowsHeight += rowHeight;
                rowIndex += 1;
                break;
            }
        }

        if (retryOnNewPage) continue;

        let showTotal = false;

        if (totalPending) {
            showTotal =
                table.footerHeight <=
                availableRowsHeight + 0.5;
            totalPending = !showTotal;
        } else if (rowIndex >= items.length) {
            showTotal =
                rowsHeight + table.footerHeight <=
                availableRowsHeight + 0.5;
            totalPending = !showTotal;
        }

        const segmentHeight =
            fixedHeight +
            rowsHeight +
            (showTotal ? table.footerHeight : 0);

        currentPage().elements.push({
            type: "table",
            gap: segmentGap,
            height: segmentHeight,
            showTitle: firstTablePage,
            rowIndexes,
            showTotal,
        });
        usedHeight += segmentGap + segmentHeight;
        firstTablePage = false;

        if (rowIndex < items.length || totalPending) {
            newPage();
        }
    } while (
        rowIndex < items.length ||
        totalPending ||
        firstTablePage
    );

    let pendingSectionGap =
        PDF_LAYOUT.tableAfterGapMm * pixelsPerMillimeter;

    if (timeData) {
        const maxLines = Math.max(
            timeData.estimatedLines.length,
            timeData.paymentLines.length,
            1,
        );
        const timeLineHeight = measurements.timeLineHeight;
        const timeTitleHeight = measurements.timeTitleHeight;
        const completeHeight =
            timeTitleHeight + maxLines * timeLineHeight;
        const maximumSectionHeight =
            timeTitleHeight +
            maxLines * timeLineHeight +
            PDF_LAYOUT.timeExtraMm * pixelsPerMillimeter;
        const needsLinePagination =
            maximumSectionHeight > pageHeight;
        let gap = sectionGap + pendingSectionGap;
        pendingSectionGap = 0;

        if (!needsLinePagination) {
            addElement(
                {
                    type: "time",
                    showTitles: true,
                    startLine: 0,
                    lineCount: maxLines,
                    timeData,
                },
                completeHeight,
                gap,
            );
        } else {
            let lineIndex = 0;
            let firstSegment = true;

            while (lineIndex < maxLines) {
                const titleHeight = firstSegment
                    ? timeTitleHeight
                    : 0;

                if (
                    usedHeight > 0 &&
                    usedHeight +
                        gap +
                        titleHeight +
                        timeLineHeight >
                        pageHeight
                ) {
                    newPage();
                    gap = 0;
                }

                const availableHeight =
                    pageHeight -
                    usedHeight -
                    gap -
                    titleHeight;
                const lineCount = Math.max(
                    1,
                    Math.min(
                        maxLines - lineIndex,
                        Math.floor(
                            availableHeight /
                                timeLineHeight,
                        ),
                    ),
                );
                const segmentHeight =
                    titleHeight +
                    lineCount * timeLineHeight;

                currentPage().elements.push({
                    type: "time",
                    gap,
                    height: segmentHeight,
                    showTitles: firstSegment,
                    startLine: lineIndex,
                    lineCount,
                    timeData,
                });
                usedHeight += gap + segmentHeight;
                lineIndex += lineCount;
                firstSegment = false;
                gap = 0;

                if (lineIndex < maxLines) newPage();
            }
        }
    }

    if (observationBlocks.length > 0) {
        let gap = sectionGap + pendingSectionGap;
        const neededHeight = Math.max(
            PDF_LAYOUT.observationsStartReserveMm *
                pixelsPerMillimeter,
            measurements.sectionTitleHeight +
                Math.min(
                    measurements.richBlocks[
                        observationBlocks[0].id
                    ]?.height || 0,
                    richMinimumReserve,
                ),
        );

        if (
            usedHeight > 0 &&
            usedHeight + gap + neededHeight > pageHeight
        ) {
            newPage();
            gap = 0;
        }

        addElement(
            {
                type: "sectionTitle",
                text: "Aclaraciones finales:",
            },
            measurements.sectionTitleHeight,
            gap,
        );

        observationBlocks.forEach(addRichBlock);
    }

    return pages.filter((page) => page.elements.length > 0);
}

function SectionTitle({ children }) {
    return (
        <div className="pb-2">
            <h3 className="font-semibold leading-6 text-gray-900">
                {children}
            </h3>
        </div>
    );
}

function RichTextBlock({ block }) {
    const lineStyle = {
        fontSize: "12.3pt",
        lineHeight: `${PDF_LAYOUT.richLineHeightMm}mm`,
    };
    const contentClassName =
        "whitespace-pre-wrap break-words text-gray-700 [overflow-wrap:anywhere] [&_strong]:font-bold [&_strong]:text-[#111111] [&_b]:font-bold [&_b]:text-[#111111] [&_u]:underline";

    if (block.type === "bullet") {
        return (
            <div>
                <ul className="list-disc pl-5">
                    <li
                        className="pl-1"
                        style={lineStyle}
                        dangerouslySetInnerHTML={{
                            __html: block.html,
                        }}
                    />
                </ul>
            </div>
        );
    }

    if (block.type === "ordered") {
        return (
            <div>
                <ol
                    className="list-decimal pl-5"
                    start={block.number}
                >
                    <li
                        className="pl-1"
                        style={lineStyle}
                        dangerouslySetInnerHTML={{
                            __html: block.html,
                        }}
                    />
                </ol>
            </div>
        );
    }

    return (
        <div>
            <div
                data-rich-content
                className={contentClassName}
                style={lineStyle}
                dangerouslySetInnerHTML={{
                    __html: block.html,
                }}
            />
        </div>
    );
}

function RichTextSlice({ block, offset, height, afterGap }) {
    return (
        <div
            style={{
                height: `${height + afterGap}px`,
            }}
        >
            <div
                className="overflow-hidden"
                style={{ height: `${height}px` }}
            >
                <div
                    style={{
                        transform: `translateY(-${offset}px)`,
                    }}
                >
                    <RichTextBlock block={block} />
                </div>
            </div>
        </div>
    );
}

function ClientSection({ presupuesto }) {
    const hasWorkAddress = hasText(presupuesto.workAddress);

    return (
        <div className="grid grid-cols-1 gap-[14mm] md:grid-cols-2">
            <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                    Cliente
                </h3>

                <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-gray-400" />

                    <p className="break-words text-gray-700">
                        {presupuesto.clientName}
                    </p>
                </div>
            </div>

            {hasWorkAddress && (
                <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                        Dirección de la obra
                    </h3>

                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />

                        <p className="break-words text-gray-700">
                            {presupuesto.workAddress.trim()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function BudgetTableTitle() {
    return (
        <div
            style={{
                height: `${PDF_TABLE_LAYOUT.titleHeightMm}mm`,
            }}
        >
            <h3
                className="font-semibold text-gray-900"
                style={{
                    fontSize: `${PDF_TABLE_LAYOUT.titleFontSizePt}pt`,
                    lineHeight: `${PDF_TABLE_LAYOUT.titleFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`,
                }}
            >
                Detalle del presupuesto
            </h3>
        </div>
    );
}

function BudgetTableColGroup() {
    return (
        <colgroup>
            <col style={{ width: "55mm" }} />
            <col style={{ width: "30mm" }} />
            <col style={{ width: "32mm" }} />
            <col style={{ width: "19mm" }} />
            <col style={{ width: "34mm" }} />
        </colgroup>
    );
}

function BudgetTableHeader({
    secondaryColor,
    headerTextColor,
}) {
    const headers = [
        "Descripción",
        "Materiales",
        "Mano de obra",
        "Cant",
        "Subtotal",
    ];

    return (
        <thead
            style={{
                backgroundColor:
                    getPreviewTableHeaderColor(secondaryColor),
            }}
        >
            <tr>
                {headers.map((header, index) => (
                    <th
                        key={header}
                        className="font-bold"
                        style={{
                            color: headerTextColor,
                            fontSize: `${PDF_TABLE_LAYOUT.headerFontSizePt}pt`,
                            lineHeight: `${PDF_TABLE_LAYOUT.headerFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`,
                            padding: `${PDF_TABLE_LAYOUT.headerVerticalPaddingMm}mm ${PDF_TABLE_LAYOUT.cellPaddingMm}mm`,
                            textAlign:
                                index === 0
                                    ? "left"
                                    : index === 3
                                      ? "center"
                                      : "right",
                            verticalAlign: "middle",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

function BudgetTableRow({ item }) {
    const baseCellStyle = {
        padding: `${PDF_TABLE_LAYOUT.cellPaddingMm}mm`,
    };
    const valueLineHeight = `${PDF_TABLE_LAYOUT.valueFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`;

    return (
        <tr>
            <td
                style={{
                    ...baseCellStyle,
                    borderBottom: `${PDF_TABLE_LAYOUT.bodyDividerWidthMm}mm solid #f3f4f6`,
                    verticalAlign: "top",
                }}
            >
                <p
                    className="break-words text-gray-800 [overflow-wrap:anywhere]"
                    style={{
                        fontSize: `${PDF_TABLE_LAYOUT.descriptionFontSizePt}pt`,
                        lineHeight: `${PDF_TABLE_LAYOUT.descriptionFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`,
                    }}
                >
                    {item.description}
                </p>
            </td>

            <td
                className="text-right text-gray-500"
                style={{
                    ...baseCellStyle,
                    fontSize: `${PDF_TABLE_LAYOUT.valueFontSizePt}pt`,
                    lineHeight: valueLineHeight,
                    verticalAlign: "middle",
                }}
            >
                {formatCurrency(item.materials || 0)}
            </td>

            <td
                className="text-right text-gray-500"
                style={{
                    ...baseCellStyle,
                    fontSize: `${PDF_TABLE_LAYOUT.valueFontSizePt}pt`,
                    lineHeight: valueLineHeight,
                    verticalAlign: "middle",
                }}
            >
                {formatCurrency(item.labor || 0)}
            </td>

            <td
                className="text-center font-medium text-gray-600"
                style={{
                    ...baseCellStyle,
                    fontSize: `${PDF_TABLE_LAYOUT.valueFontSizePt}pt`,
                    lineHeight: valueLineHeight,
                    verticalAlign: "middle",
                }}
            >
                {item.quantity}
            </td>

            <td
                className="text-right font-semibold text-gray-900"
                style={{
                    ...baseCellStyle,
                    fontSize: `${PDF_TABLE_LAYOUT.valueFontSizePt}pt`,
                    lineHeight: valueLineHeight,
                    verticalAlign: "middle",
                }}
            >
                {formatCurrency(item.subtotal || 0)}
            </td>
        </tr>
    );
}

function BudgetTableFooter({ total, primaryColor }) {
    return (
        <tfoot>
            <tr
                className="bg-gray-50"
                style={{
                    height: `${PDF_TABLE_LAYOUT.footerHeightMm}mm`,
                }}
            >
                <td
                    colSpan="3"
                    className="text-right font-semibold text-gray-500"
                    style={{
                        borderTop: `${PDF_TABLE_LAYOUT.footerDividerWidthMm}mm solid ${primaryColor}`,
                        padding: `${PDF_TABLE_LAYOUT.cellPaddingMm}mm`,
                        fontSize: `${PDF_TABLE_LAYOUT.totalLabelFontSizePt}pt`,
                        lineHeight: `${PDF_TABLE_LAYOUT.totalLabelFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`,
                        verticalAlign: "middle",
                    }}
                >
                    TOTAL
                </td>

                <td
                    colSpan="2"
                    className="whitespace-nowrap text-right font-bold"
                    style={{
                        borderTop: `${PDF_TABLE_LAYOUT.footerDividerWidthMm}mm solid ${primaryColor}`,
                        color: primaryColor,
                        padding: `${PDF_TABLE_LAYOUT.cellPaddingMm}mm`,
                        fontSize: `${PDF_TABLE_LAYOUT.totalFontSizePt}pt`,
                        lineHeight: `${PDF_TABLE_LAYOUT.totalFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`,
                        verticalAlign: "middle",
                    }}
                >
                    {formatCurrency(total || 0)}
                </td>
            </tr>
        </tfoot>
    );
}

function BudgetTableOutline() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
                border: `${PDF_TABLE_LAYOUT.borderWidthMm}mm solid #e5e7eb`,
                borderRadius: `${PDF_TABLE_LAYOUT.radiusMm}mm`,
            }}
        />
    );
}

function BudgetTableSegment({
    presupuesto,
    items,
    rowIndexes,
    showTitle,
    showTotal,
    secondaryColor,
    headerTextColor,
    primaryColor,
}) {
    return (
        <div>
            {showTitle && <BudgetTableTitle />}

            <div
                className="relative overflow-hidden bg-white"
                style={{
                    borderRadius: `${PDF_TABLE_LAYOUT.radiusMm}mm`,
                }}
            >
                <table className="w-full table-fixed">
                    <BudgetTableColGroup />

                    <BudgetTableHeader
                        secondaryColor={secondaryColor}
                        headerTextColor={headerTextColor}
                    />

                    <tbody className="bg-white">
                        {rowIndexes.map((rowIndex) => (
                            <BudgetTableRow
                                key={
                                    items[rowIndex].idItem ??
                                    rowIndex
                                }
                                item={items[rowIndex]}
                            />
                        ))}
                    </tbody>

                    {showTotal && (
                        <BudgetTableFooter
                            total={presupuesto.total}
                            primaryColor={primaryColor}
                        />
                    )}
                </table>

                <BudgetTableOutline />
            </div>
        </div>
    );
}

function TimeAndPaymentSegment({
    presupuesto,
    timeData,
    showTitles,
    startLine,
    lineCount,
}) {
    const hasEstimatedTime = hasText(
        presupuesto.estimatedTime,
    );
    const hasPaymentTerms = hasText(
        presupuesto.paymentTerms,
    );

    const renderColumn = (title, lines) => (
        <div>
            {showTitles && (
                <div className="pb-2">
                    <h3 className="font-semibold leading-6 text-gray-900">
                        {title}
                    </h3>
                </div>
            )}

            <div className="text-gray-700">
                {Array.from(
                    { length: lineCount },
                    (_, offset) => (
                        <div
                            key={startLine + offset}
                            className="min-h-6 whitespace-pre-wrap break-words leading-6 [overflow-wrap:anywhere]"
                        >
                            {lines[startLine + offset]}
                        </div>
                    ),
                )}
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 gap-[14mm] md:grid-cols-2">
            {hasEstimatedTime &&
                renderColumn(
                    "Tiempo estimado:",
                    timeData.estimatedLines,
                )}

            {hasPaymentTerms &&
                renderColumn(
                    "Condiciones de pago:",
                    timeData.paymentLines,
                )}
        </div>
    );
}

function MeasurementContent({
    measurementRef,
    presupuesto,
    items,
    jobBlocks,
    observationBlocks,
    secondaryColor,
    headerTextColor,
    primaryColor,
}) {
    return (
        <div
            ref={measurementRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 -z-50 w-[170mm] bg-white"
            style={{
                left: "-10000px",
                visibility: "hidden",
            }}
        >
            <div data-measure="client">
                <ClientSection presupuesto={presupuesto} />
            </div>

            <div data-measure="section-title">
                <SectionTitle>Sección</SectionTitle>
            </div>

            {[...jobBlocks, ...observationBlocks].map(
                (block) => (
                    <div
                        key={block.id}
                        data-rich-block={block.id}
                    >
                        <RichTextBlock block={block} />
                    </div>
                ),
            )}

            <div data-measure="table-title">
                <BudgetTableTitle />
            </div>

            <div
                data-measure="table-frame"
                className="relative overflow-hidden bg-white"
                style={{
                    borderRadius: `${PDF_TABLE_LAYOUT.radiusMm}mm`,
                }}
            >
                <table className="w-full table-fixed">
                    <BudgetTableColGroup />

                    <BudgetTableHeader
                        secondaryColor={secondaryColor}
                        headerTextColor={headerTextColor}
                    />

                    <tbody className="bg-white">
                        {items.map((item, index) => (
                            <BudgetTableRow
                                key={item.idItem ?? index}
                                item={item}
                            />
                        ))}
                    </tbody>

                    <BudgetTableFooter
                        total={presupuesto.total}
                        primaryColor={primaryColor}
                    />
                </table>

                <BudgetTableOutline />
            </div>

            <div
                data-measure="time"
                className="grid grid-cols-1 gap-[14mm] md:grid-cols-2"
            >
                {hasText(presupuesto.estimatedTime) && (
                    <div data-time-column="estimated">
                        <div
                            data-measure="time-title"
                            className="pb-2"
                        >
                            <h3 className="font-semibold leading-6 text-gray-900">
                                Tiempo estimado:
                            </h3>
                        </div>

                        <p className="leading-6 text-gray-700">
                            {presupuesto.estimatedTime.trim()}
                        </p>
                    </div>
                )}

                {hasText(presupuesto.paymentTerms) && (
                    <div data-time-column="payment">
                        <div
                            data-measure="time-title"
                            className="pb-2"
                        >
                            <h3 className="font-semibold leading-6 text-gray-900">
                                Condiciones de pago:
                            </h3>
                        </div>

                        <p className="leading-6 text-gray-700">
                            {presupuesto.paymentTerms.trim()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function PresupuestoPreview({ presupuesto, company, items }) {
    const primaryColor = company?.colorMain || "#ef4444";
    const secondaryColor = company?.colorSecondary || "#000000";
    const logoSrc = company?.logoUrl?.trim() || null;
    const headerRef = useRef(null);
    const mainRef = useRef(null);
    const pageRef = useRef(null);
    const measurementRef = useRef(null);
    const [pagination, setPagination] = useState({
        pages: [createEmptyPage()],
    });
    const [loadedLogo, setLoadedLogo] = useState(null);
    const logoImageSize =
        loadedLogo?.src === logoSrc && !loadedLogo.error
            ? {
                  width: loadedLogo.width,
                  height: loadedLogo.height,
              }
            : null;
    const hasEstimatedTime = hasText(presupuesto.estimatedTime);
    const hasPaymentTerms = hasText(presupuesto.paymentTerms);

    const normalizedJobDescription = normalizeRichTextHtml(
        presupuesto.jobDescription,
    );

    const formattedJobDescription = applyOrderedListStartValues(
        normalizedJobDescription,
    );

    const safeJobDescription = DOMPurify.sanitize(
        formattedJobDescription,
        {
            ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "b",
                "u",
                "ul",
                "ol",
                "li",
            ],
            ALLOWED_ATTR: ["start"],
        },
    );

    const normalizedObservations = normalizeRichTextHtml(
        presupuesto.observations,
    );

    const formattedObservations = applyOrderedListStartValues(
        normalizedObservations,
    );

    const safeObservations = DOMPurify.sanitize(
        formattedObservations,
        {
            ALLOWED_TAGS: [
                "p",
                "br",
                "strong",
                "b",
                "u",
                "ul",
                "ol",
                "li",
            ],
            ALLOWED_ATTR: ["start"],
        },
    );
    const jobBlocks = useMemo(
        () =>
            hasRichTextContent(safeJobDescription)
                ? getRichTextBlocks(
                      safeJobDescription,
                      "job",
                  )
                : [],
        [safeJobDescription],
    );
    const observationBlocks = useMemo(
        () =>
            hasRichTextContent(safeObservations)
                ? getRichTextBlocks(
                      safeObservations,
                      "observations",
                  )
                : [],
        [safeObservations],
    );

    const isLightColor = (hex) => {
        if (!hex) return false;

        const color = hex.replace("#", "");

        if (color.length !== 6) return false;

        const r = Number.parseInt(color.substring(0, 2), 16);
        const g = Number.parseInt(color.substring(2, 4), 16);
        const b = Number.parseInt(color.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 155;
    };

    const headerTextColor = isLightColor(secondaryColor)
        ? "#111827"
        : "#ffffff";

    useLayoutEffect(() => {
        const mainElement = mainRef.current;
        const headerElement = headerRef.current;
        const pageElement = pageRef.current;
        const measurementElement = measurementRef.current;

        if (
            !mainElement ||
            !headerElement ||
            !pageElement ||
            !measurementElement
        ) {
            return undefined;
        }

        let isActive = true;

        const measurePages = () => {
            if (!isActive) return;

            const mainHeight = mainElement.clientHeight;
            const pageWidth =
                pageElement.getBoundingClientRect().width;
            const pixelsPerMillimeter =
                pageWidth / PDF_LAYOUT.pageWidthMm;
            const toHeight = (element) =>
                element?.getBoundingClientRect().height || 0;
            const richBlocks = {};

            measurementElement
                .querySelectorAll("[data-rich-block]")
                .forEach((element) => {
                    const block = [
                        ...jobBlocks,
                        ...observationBlocks,
                    ].find(
                        (candidate) =>
                            candidate.id ===
                            element.dataset.richBlock,
                    );

                    if (!block) return;

                    const height = toHeight(element);
                    const contentElement =
                        element.querySelector("li") ||
                        element.querySelector(
                            "[data-rich-content]",
                        );
                    const computedStyle = contentElement
                        ? getComputedStyle(contentElement)
                        : null;
                    const lineHeight =
                        Number.parseFloat(
                            computedStyle?.lineHeight,
                        ) ||
                        PDF_LAYOUT.richLineHeightMm *
                            pixelsPerMillimeter;
                    const contentHeight = Math.max(
                        lineHeight,
                        height,
                    );
                    const lineCount = Math.max(
                        1,
                        Math.ceil(
                            (contentHeight - 0.5) /
                                lineHeight,
                        ),
                    );
                    richBlocks[block.id] = {
                        height: lineCount * lineHeight,
                        lineHeight,
                        lineCount,
                    };
                });

            const tableFrame =
                measurementElement.querySelector(
                    '[data-measure="table-frame"]',
                );
            const tableElement =
                tableFrame?.querySelector("table");
            const tableRows = tableElement
                ? Array.from(
                      tableElement.tBodies[0]?.rows || [],
                  ).map(toHeight)
                : [];
            const estimatedColumn =
                measurementElement.querySelector(
                    '[data-time-column="estimated"] p',
                );
            const paymentColumn =
                measurementElement.querySelector(
                    '[data-time-column="payment"] p',
                );
            const sampleColumn =
                estimatedColumn || paymentColumn;
            const sampleStyle = sampleColumn
                ? getComputedStyle(sampleColumn)
                : null;
            const wrapFont = sampleStyle
                ? `${sampleStyle.fontWeight} ${sampleStyle.fontSize} ${sampleStyle.fontFamily}`
                : "400 16px Inter, sans-serif";
            const timeData =
                hasEstimatedTime || hasPaymentTerms
                    ? {
                          estimatedLines: hasEstimatedTime
                              ? wrapPlainText(
                                    presupuesto.estimatedTime,
                                    estimatedColumn?.clientWidth ||
                                        0,
                                    wrapFont,
                                )
                              : [],
                          paymentLines: hasPaymentTerms
                              ? wrapPlainText(
                                    presupuesto.paymentTerms,
                                    paymentColumn?.clientWidth ||
                                        0,
                                    wrapFont,
                                )
                              : [],
                      }
                    : null;
            const timeTitles = Array.from(
                measurementElement.querySelectorAll(
                    '[data-measure="time-title"]',
                ),
            );
            const timeTitleHeight = Math.max(
                ...timeTitles.map(toHeight),
                PDF_LAYOUT.timeTitleHeightMm *
                    pixelsPerMillimeter,
            );
            const timeLineHeight =
                Number.parseFloat(sampleStyle?.lineHeight) ||
                PDF_LAYOUT.timeLineHeightMm *
                    pixelsPerMillimeter;
            const measurements = {
                clientHeight: toHeight(
                    measurementElement.querySelector(
                        '[data-measure="client"]',
                    ),
                ),
                sectionTitleHeight: toHeight(
                    measurementElement.querySelector(
                        '[data-measure="section-title"]',
                    ),
                ),
                richBlocks,
                table: {
                    titleHeight: toHeight(
                        measurementElement.querySelector(
                            '[data-measure="table-title"]',
                        ),
                    ),
                    frameExtra: Math.max(
                        0,
                        toHeight(tableFrame) -
                            toHeight(tableElement),
                    ),
                    headerHeight: toHeight(
                        tableElement?.tHead,
                    ),
                    rowHeights: tableRows,
                    footerHeight: toHeight(
                        tableElement?.tFoot,
                    ),
                },
                timeTitleHeight,
                timeLineHeight,
            };
            const pages = buildPreviewPages({
                pageHeight: mainHeight,
                pixelsPerMillimeter,
                measurements,
                jobBlocks,
                observationBlocks,
                items,
                timeData,
            });

            setPagination({
                pages,
            });
        };

        measurePages();
        document.fonts?.ready.then(measurePages);

        return () => {
            isActive = false;
        };
    }, [
        company,
        hasEstimatedTime,
        hasPaymentTerms,
        items,
        jobBlocks,
        observationBlocks,
        presupuesto,
    ]);

    const renderElement = (element, elementIndex) => {
        const style = {
            marginTop: `${element.gap || 0}px`,
        };

        if (element.type === "client") {
            return (
                <div
                    key={`client-${elementIndex}`}
                    style={style}
                >
                    <ClientSection presupuesto={presupuesto} />
                </div>
            );
        }

        if (element.type === "sectionTitle") {
            return (
                <div
                    key={`title-${elementIndex}`}
                    style={style}
                >
                    <SectionTitle>
                        {element.text}
                    </SectionTitle>
                </div>
            );
        }

        if (element.type === "richBlock") {
            return (
                <div
                    key={`${element.block.id}-${elementIndex}`}
                    style={style}
                >
                    <RichTextSlice
                        block={element.block}
                        offset={element.sliceOffset}
                        height={element.sliceHeight}
                        afterGap={element.afterGap}
                    />
                </div>
            );
        }

        if (element.type === "table") {
            return (
                <div
                    key={`table-${elementIndex}`}
                    style={style}
                >
                    <BudgetTableSegment
                        presupuesto={presupuesto}
                        items={items}
                        rowIndexes={element.rowIndexes}
                        showTitle={element.showTitle}
                        showTotal={element.showTotal}
                        secondaryColor={secondaryColor}
                        headerTextColor={headerTextColor}
                        primaryColor={primaryColor}
                    />
                </div>
            );
        }

        if (element.type === "time") {
            return (
                <div
                    key={`time-${elementIndex}`}
                    style={style}
                >
                    <TimeAndPaymentSegment
                        presupuesto={presupuesto}
                        timeData={element.timeData}
                        showTitles={element.showTitles}
                        startLine={element.startLine}
                        lineCount={element.lineCount}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full overflow-x-auto bg-slate-100 px-4 py-8">
            {logoSrc && loadedLogo?.src !== logoSrc && (
                <img
                    key={logoSrc}
                    src={logoSrc}
                    alt=""
                    aria-hidden="true"
                    crossOrigin="anonymous"
                    className="pointer-events-none fixed -z-50 h-px w-px"
                    style={{
                        left: "-10000px",
                        visibility: "hidden",
                    }}
                    onLoad={(event) => {
                        setLoadedLogo({
                            src: logoSrc,
                            width: event.currentTarget.naturalWidth,
                            height: event.currentTarget.naturalHeight,
                            error: false,
                        });
                    }}
                    onError={() => {
                        setLoadedLogo({
                            src: logoSrc,
                            width: 0,
                            height: 0,
                            error: true,
                        });
                    }}
                />
            )}

            <MeasurementContent
                measurementRef={measurementRef}
                presupuesto={presupuesto}
                items={items}
                jobBlocks={jobBlocks}
                observationBlocks={observationBlocks}
                secondaryColor={secondaryColor}
                headerTextColor={headerTextColor}
                primaryColor={primaryColor}
            />

            <div className="space-y-8">
                {pagination.pages.map(
                    (page, pageIndex) => (
                        <section
                            key={pageIndex}
                            ref={
                                pageIndex === 0
                                    ? pageRef
                                    : null
                            }
                            className="relative mx-auto box-border flex h-[297mm] w-[210mm] shrink-0 flex-col overflow-hidden bg-white text-black shadow-[0_20px_60px_rgba(15,23,42,0.16)]"
                            style={{
                                padding: `12mm 20mm ${PDF_LAYOUT.footerReservedSpaceMm}mm`,
                            }}
                        >
                            <PreviewHeader
                                company={company}
                                presupuesto={presupuesto}
                                primaryColor={primaryColor}
                                logoSrc={logoSrc}
                                logoImageSize={logoImageSize}
                                headerRef={
                                    pageIndex === 0
                                        ? headerRef
                                        : null
                                }
                            />

                            <main
                                ref={
                                    pageIndex === 0
                                        ? mainRef
                                        : null
                                }
                                className="min-h-0 flex-1 overflow-hidden"
                                style={{
                                    marginTop: `${PDF_LAYOUT.mainGapAfterHeaderMm}mm`,
                                }}
                            >
                                {page.elements.map(
                                    renderElement,
                                )}
                            </main>

                            <PreviewFooter
                                company={company}
                                presupuesto={presupuesto}
                                primaryColor={primaryColor}
                                isLastPage={
                                    pageIndex ===
                                    pagination.pages.length - 1
                                }
                            />
                        </section>
                    ),
                )}
            </div>
        </div>
    );
}

PresupuestoPreview.propTypes = {
    presupuesto: PropTypes.shape({
        budgetNumber: PropTypes.string,
        clientName: PropTypes.string,
        fechaPresupuesto: PropTypes.string,
        fechaVencimiento: PropTypes.string,
        workAddress: PropTypes.string,
        jobDescription: PropTypes.string,
        estimatedTime: PropTypes.string,
        paymentTerms: PropTypes.string,
        observations: PropTypes.string,
        total: PropTypes.number,
    }).isRequired,

    company: PropTypes.shape({
        name: PropTypes.string,
        logoUrl: PropTypes.string,
        colorMain: PropTypes.string,
        colorSecondary: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
    }),

    items: PropTypes.arrayOf(
        PropTypes.shape({
            idItem: PropTypes.number,
            description: PropTypes.string,
            materials: PropTypes.number,
            labor: PropTypes.number,
            quantity: PropTypes.number,
            subtotal: PropTypes.number,
        }),
    ).isRequired,
};

export default PresupuestoPreview;
