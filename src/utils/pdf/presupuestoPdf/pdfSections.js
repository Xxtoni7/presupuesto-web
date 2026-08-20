import autoTable, { __createTable } from "jspdf-autotable";
import { formatCurrency } from "../../formatCurrency";
import { pdfTheme } from "./pdfTheme";
import { formatPdfDate, parseRichTextHtml, hasRichTextContent } from "./pdfHelpers";

function getContainedImageSize(image, maxWidth, maxHeight) {
    const imageWidth = image?.naturalWidth || image?.width || maxWidth;
    const imageHeight = image?.naturalHeight || image?.height || maxHeight;

    const imageRatio = imageWidth / imageHeight;
    const containerRatio = maxWidth / maxHeight;

    if (imageRatio > containerRatio) {
        return {
            width: maxWidth,
            height: maxWidth / imageRatio,
        };
    }

    return {
        width: maxHeight * imageRatio,
        height: maxHeight,
    };
}

function getLogoBoxSize(image) {
    const defaultSize = {
        width: 32,
        height: 27,
    };

    if (!image) return defaultSize;

    const imageWidth = image?.naturalWidth || image?.width;
    const imageHeight = image?.naturalHeight || image?.height;

    if (!imageWidth || !imageHeight) return defaultSize;

    const ratio = imageWidth / imageHeight;

    const height = 27;
    const minWidth = 30;
    const maxWidth = 42;

    const calculatedWidth = height * ratio;

    return {
        width: Math.min(Math.max(calculatedWidth, minWidth), maxWidth),
        height,
    };
}

function getReadableTextColor(rgb) {
    const [r, g, b] = rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155 ? [17, 24, 39] : [255, 255, 255];
}

export function drawHeader(doc, company, presupuesto, primaryColor, logoImage, headerIcons) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;

    const logoBoxX = marginX;
    const logoBoxY = 14;

    let companyTextX = marginX;

    if (logoImage) {
        const logoBoxSize = getLogoBoxSize(logoImage);
        const logoBoxWidth = logoBoxSize.width;
        const logoBoxHeight = logoBoxSize.height;

        const logoPadding = 0.8;
        const logoMaxWidth = logoBoxWidth - logoPadding * 2;
        const logoMaxHeight = logoBoxHeight - logoPadding * 2;

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.4);

        doc.roundedRect(
            logoBoxX,
            logoBoxY,
            logoBoxWidth,
            logoBoxHeight,
            2.5,
            2.5,
            "FD"
        );

        const imageFormat =
            logoImage.src?.toLowerCase().includes(".jpg") ||
            logoImage.src?.toLowerCase().includes(".jpeg")
                ? "JPEG"
                : "PNG";

        const containedSize = getContainedImageSize(
            logoImage,
            logoMaxWidth,
            logoMaxHeight
        );

        const logoX = logoBoxX + (logoBoxWidth - containedSize.width) / 2;
        const logoY = logoBoxY + (logoBoxHeight - containedSize.height) / 2;

        doc.addImage(
            logoImage,
            imageFormat,
            logoX,
            logoY,
            containedSize.width,
            containedSize.height
        );

        companyTextX = logoBoxX + logoBoxWidth + 6;
    }

    // Company Name
    doc.setFont("Inter", "semibold");
    doc.setFontSize(13);
    doc.setTextColor(...pdfTheme.colors.text);

    const companyName = company?.name || "Empresa";

    const companyNameMaxWidth =
        pageWidth - marginX - companyTextX - 72;

    const companyNameLines = doc
        .splitTextToSize(companyName, companyNameMaxWidth)
        .slice(0, 2);

    doc.text(
        companyNameLines,
        companyTextX,
        23
    );

    doc.setFont("Inter", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...pdfTheme.colors.muted);

    const infoIconX = companyTextX;
    const infoTextX = companyTextX + 6.5;

    let companyInfoY = 31;

    if (companyNameLines.length > 1) {
        companyInfoY += 5;
    }

    const rightSectionLimitX = pageWidth - marginX - 72;
    const emailExtraWidth = 15;
    const companyInfoMaxWidth = rightSectionLimitX - infoTextX + emailExtraWidth;
    const companyInfoLineHeight = 4.8;

    // Phone
    if (company?.phone) {
        if (headerIcons?.phone) {
            doc.addImage(
                headerIcons.phone,
                "PNG",
                infoIconX,
                companyInfoY - 3.4,
                3.6,
                3.6
            );
        }

        doc.text(
            company.phone,
            infoTextX,
            companyInfoY
        );

        companyInfoY += 5.5;
    }

    // Email
    if (company?.email) {
        if (headerIcons?.mail) {
            doc.addImage(
                headerIcons.mail,
                "PNG",
                infoIconX + 0.2,
                companyInfoY - 2.8,
                3.4,
                3.4
            );
        }

        const emailLines = doc
            .splitTextToSize(company.email, companyInfoMaxWidth)
            .slice(0, 2);

        emailLines.forEach((line, index) => {
            doc.text(
                line,
                infoTextX,
                companyInfoY + index * companyInfoLineHeight
            );
        });
    }

    // Presupuesto Title
    const rightX = pageWidth - marginX;

    doc.setFont("Inter", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);

    doc.text(
        "PRESUPUESTO",
        rightX,
        22,
        { align: "right" }
    );

    // Presupuesto Number
    doc.setFont("Inter", "semibold");
    doc.setFontSize(12.5);
    doc.setTextColor(...pdfTheme.colors.text);

    doc.text(
        presupuesto?.budgetNumber || "-",
        rightX,
        30,
        { align: "right" }
    );

    // Presupuesto Date
    doc.setFont("Inter", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...pdfTheme.colors.muted);

    const dateText = formatPdfDate(presupuesto?.fechaPresupuesto);
    const dateTextWidth = doc.getTextWidth(dateText);
    const calendarIconSize = 3.8;
    const calendarGap = 3;

    if (headerIcons?.calendar) {
        doc.addImage(
            headerIcons.calendar,
            "PNG",
            rightX - dateTextWidth - calendarIconSize - calendarGap + 1.2,
            34.6,
            calendarIconSize,
            calendarIconSize
        );
    }

    doc.text(
        dateText,
        rightX,
        37.8,
        { align: "right" }
    );

    // Divider
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.6);

    doc.line(
        marginX,
        48,
        pageWidth - marginX,
        48
    );
}

export function drawClientInfo(doc, presupuesto, pdfIcons) {
    let currentY = 62;

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const columnGap = 14;
    const columnWidth = (pageWidth - marginX * 2 - columnGap) / 2;

    const leftX = marginX;
    const rightX = marginX + columnWidth + columnGap;

    const clientInfoY = currentY + 8;
    const valueLineHeight = 5;

    // CLIENTE
    doc.setFont("Inter", "semibold");
    doc.setFontSize(13);
    doc.setTextColor(...pdfTheme.colors.text);

    doc.text(
        "Cliente",
        leftX,
        currentY
    );

    doc.setFont("Inter", "normal");
    doc.setFontSize(12.3);
    doc.setTextColor(55, 65, 81);

    if (pdfIcons?.user) {
        doc.addImage(
            pdfIcons.user,
            "PNG",
            leftX,
            clientInfoY - 4.5,
            5.2,
            5.2
        );
    }

    const clientNameLines = doc.splitTextToSize(
        presupuesto?.clientName || "-",
        columnWidth - 8
    );

    doc.text(
        clientNameLines,
        leftX + 7,
        clientInfoY
    );

    const clientHeight = clientNameLines.length * valueLineHeight;

    // DIRECCIÓN DE LA OBRA
    let addressHeight = 0;

    if (presupuesto?.workAddress) {
        doc.setFont("Inter", "semibold");
        doc.setFontSize(13);
        doc.setTextColor(...pdfTheme.colors.text);

        doc.text(
            "Dirección de la obra",
            rightX,
            currentY
        );

        doc.setFont("Inter", "normal");
        doc.setFontSize(12.3);
        doc.setTextColor(55, 65, 81);

        if (pdfIcons?.mapPin) {
            doc.addImage(
                pdfIcons.mapPin,
                "PNG",
                rightX,
                clientInfoY - 4.5,
                5.2,
                5.2
            );
        }

        const addressLines = doc.splitTextToSize(
            presupuesto.workAddress,
            columnWidth - 8
        );

        doc.text(
            addressLines,
            rightX + 7,
            clientInfoY
        );

        addressHeight = addressLines.length * valueLineHeight;
    }

    const sectionHeight = Math.max(
        clientHeight,
        addressHeight,
        3
    );

    return clientInfoY + sectionHeight;
}

// Job Description with Rich Text (supports basic formatting and lists)
function getSegmentFontStyle(segment) {
    return segment.bold ? "bold" : "normal";
}

function drawTextWithStyle(doc, text, x, y, segment) {
    doc.setFont("Inter", getSegmentFontStyle(segment));
    doc.setFontSize(pdfTheme.main.valueSize);

    const textColor = segment.bold
        ? pdfTheme.main.titleColor
        : pdfTheme.main.valueColor;

    doc.setTextColor(...textColor);
    doc.text(text, x, y);

    if (segment.underline) {
        const textWidth = doc.getTextWidth(text);

        doc.setDrawColor(...textColor);
        doc.setLineWidth(0.25);
        doc.line(
            x,
            y + 0.8,
            x + textWidth,
            y + 0.8
        );
    }
}

function getFittingCharacterCount(doc, characters, maxWidth) {
    if (!characters.length || maxWidth <= 0) {
        return 0;
    }

    let lowerBound = 1;
    let upperBound = characters.length;
    let fittingCount = 0;

    while (lowerBound <= upperBound) {
        const middle = Math.floor((lowerBound + upperBound) / 2);
        const candidate = characters.slice(0, middle).join("");

        if (doc.getTextWidth(candidate) <= maxWidth) {
            fittingCount = middle;
            lowerBound = middle + 1;
        } else {
            upperBound = middle - 1;
        }
    }

    return fittingCount;
}

function drawInlineSegments(
    doc,
    segments,
    startX,
    startY,
    maxWidth,
    onNewPage
) {
    let currentX = startX;
    let currentY = startY;

    const lineHeight = pdfTheme.main.lineHeight;
    const endX = startX + maxWidth;

    const moveToNextLine = () => {
        currentX = startX;
        currentY += lineHeight;
        currentY = ensurePageSpace(
            doc,
            currentY,
            lineHeight,
            onNewPage
        );
    };

    segments.forEach((segment) => {
        const parts = segment.text
            .replaceAll("\r\n", "\n")
            .replaceAll("\r", "\n")
            .split(/(\n|[^\S\n]+)/);

        parts.forEach((part) => {
            if (!part) return;

            if (part === "\n") {
                moveToNextLine();
                return;
            }

            doc.setFont("Inter", getSegmentFontStyle(segment));
            doc.setFontSize(pdfTheme.main.valueSize);

            const partWidth = doc.getTextWidth(part);
            const isOnlySpace = part.trim() === "";

            if (isOnlySpace) {
                drawTextWithStyle(
                    doc,
                    part,
                    currentX,
                    currentY,
                    segment
                );

                currentX += partWidth;
                return;
            }

            if (partWidth <= maxWidth) {
                if (currentX + partWidth > endX) {
                    moveToNextLine();
                }

                drawTextWithStyle(
                    doc,
                    part,
                    currentX,
                    currentY,
                    segment
                );

                currentX += partWidth;
                return;
            }

            const remainingCharacters = Array.from(part);

            while (remainingCharacters.length > 0) {
                const availableWidth = endX - currentX;
                let fittingCount = getFittingCharacterCount(
                    doc,
                    remainingCharacters,
                    availableWidth
                );

                if (fittingCount === 0 && currentX > startX) {
                    moveToNextLine();
                    continue;
                }

                if (fittingCount === 0) {
                    fittingCount = 1;
                }

                const chunk = remainingCharacters
                    .splice(0, fittingCount)
                    .join("");

                drawTextWithStyle(
                    doc,
                    chunk,
                    currentX,
                    currentY,
                    segment
                );

                currentX += doc.getTextWidth(chunk);

                if (remainingCharacters.length > 0) {
                    moveToNextLine();
                }
            }
        });
    });

    return currentY + lineHeight;
}

function drawRichTextBlock(
    doc,
    block,
    startX,
    startY,
    maxWidth,
    onNewPage
) {
    if (block.type === "empty") {
        return startY + pdfTheme.main.lineHeight;
    }
    
    let contentX = startX;
    let contentWidth = maxWidth;

    doc.setFont("Inter", "normal");
    doc.setFontSize(pdfTheme.main.valueSize);
    doc.setTextColor(...pdfTheme.main.valueColor);

    if (block.type === "bullet") {
        doc.text("•", startX + 1, startY);

        contentX = startX + 8;
        contentWidth = maxWidth - 8;
    }

    if (block.type === "ordered") {
        const prefix = `${block.number}.`;

        doc.text(prefix, startX, startY);

        contentX = startX + 8;
        contentWidth = maxWidth - 8;
    }

    return drawInlineSegments(
        doc,
        block.segments,
        contentX,
        startY,
        contentWidth,
        onNewPage
    );
}

function ensurePageSpace(doc, currentY, neededHeight, onNewPage) {
    const pageHeight = doc.internal.pageSize.getHeight();

    const maxContentY =
        pageHeight - pdfTheme.page.footerReservedSpace;

    if (currentY + neededHeight <= maxContentY) {
        return currentY;
    }

    doc.addPage();

    if (onNewPage) {
        onNewPage();
    }

    return pdfTheme.page.contentTopAfterHeader;
}

function splitPlainTextToLines(doc, text, maxWidth) {
    if (!text) return [];

    const paragraphs = String(text)
        .replaceAll("\r\n", "\n")
        .replaceAll("\r", "\n")
        .split("\n");

    const lines = [];

    paragraphs.forEach((paragraph) => {
        if (paragraph === "") {
            lines.push("");
            return;
        }

        lines.push(
            ...doc.splitTextToSize(paragraph, maxWidth)
        );
    });

    return lines;
}

function drawPlainTextColumns(
    doc,
    columns,
    startY,
    reservedLineHeight,
    onNewPage
) {
    let currentY = startY;
    let lastLineY = startY;
    const maxLines = Math.max(
        ...columns.map((column) => column.lines.length),
        0
    );

    doc.setFont("Inter", "normal");
    doc.setFontSize(pdfTheme.main.valueSize);

    const textLineHeight =
        doc.getLineHeight() / doc.internal.scaleFactor;

    for (let lineIndex = 0; lineIndex < maxLines; lineIndex += 1) {
        currentY = ensurePageSpace(
            doc,
            currentY,
            reservedLineHeight,
            onNewPage
        );

        doc.setFont("Inter", "normal");
        doc.setFontSize(pdfTheme.main.valueSize);
        doc.setTextColor(...pdfTheme.main.valueColor);

        columns.forEach((column) => {
            const line = column.lines[lineIndex];

            if (line !== undefined && line !== "") {
                doc.text(
                    line,
                    column.x,
                    currentY
                );
            }
        });

        lastLineY = currentY;
        currentY += textLineHeight;
    }

    return maxLines > 0
        ? lastLineY + pdfTheme.main.textEndReserve
        : startY;
}

export function drawJobDescription(doc, presupuesto, startY, onNewPage) {
    if (!hasRichTextContent(presupuesto?.jobDescription)) {
        return startY;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const maxWidth = pageWidth - marginX * 2;

    let currentY = startY + pdfTheme.main.sectionGap;

    currentY = ensurePageSpace(
        doc,
        currentY,
        16,
        onNewPage
    );

    doc.setFont("Inter", "semibold");
    doc.setFontSize(pdfTheme.main.titleSize);
    doc.setTextColor(...pdfTheme.main.titleColor);

    doc.text("Descripción del trabajo:", marginX, currentY);

    currentY += 8;

    const blocks = parseRichTextHtml(presupuesto.jobDescription);
    let sectionEndY = currentY;

    blocks.forEach((block) => {
        currentY = ensurePageSpace(
            doc,
            currentY,
            pdfTheme.main.lineHeight + 4,
            onNewPage
        );

        currentY = drawRichTextBlock(
            doc,
            block,
            marginX,
            currentY,
            maxWidth,
            onNewPage
        );

        sectionEndY =
            currentY -
            pdfTheme.main.lineHeight +
            pdfTheme.main.textEndReserve;
        currentY += 2;
    });

    return sectionEndY;
}

function hasItemCost(items, field) {
    return items.some((item) => {
        const value = Number(item[field]);

        return Number.isFinite(value) && value !== 0;
    });
}

function getBudgetTableColumns(items) {
    const showMaterials = hasItemCost(items, "materials");
    const showLabor = hasItemCost(items, "labor");
    const descriptionWidth =
        55 + (showMaterials ? 0 : 30) + (showLabor ? 0 : 32);
    const columns = [
        {
            key: "description",
            header: "Descripción",
            width: descriptionWidth,
            formatValue: (item) => item.description || "-",
            styles: {
                halign: "left",
                fontSize: 11,
                textColor: [31, 41, 55],
            },
        },
    ];

    if (showMaterials) {
        columns.push({
            key: "materials",
            header: "Materiales",
            width: 30,
            formatValue: (item) =>
                formatCurrency(item.materials || 0),
            styles: {
                halign: "right",
                valign: "middle",
                fontSize: 9.5,
                textColor: [107, 114, 128],
            },
        });
    }

    if (showLabor) {
        columns.push({
            key: "labor",
            header: "Mano de obra",
            width: 32,
            formatValue: (item) =>
                formatCurrency(item.labor || 0),
            styles: {
                halign: "right",
                valign: "middle",
                fontSize: 9.5,
                textColor: [107, 114, 128],
            },
        });
    }

    columns.push(
        {
            key: "quantity",
            header: "Cant",
            width: 19,
            formatValue: (item) => item.quantity || 0,
            styles: {
                halign: "center",
                valign: "middle",
                fontSize: 9.5,
                fontStyle: "medium",
                textColor: [75, 85, 99],
            },
        },
        {
            key: "subtotal",
            header: "Subtotal",
            width: 34,
            formatValue: (item) =>
                formatCurrency(item.subtotal || 0),
            styles: {
                halign: "right",
                valign: "middle",
                fontSize: 9.5,
                fontStyle: "semibold",
                textColor: [17, 24, 39],
            },
        }
    );

    return columns;
}

function getBudgetTableColumnStyles(columns) {
    return Object.fromEntries(
        columns.map((column, index) => [
            index,
            {
                cellWidth: column.width,
                ...column.styles,
            },
        ])
    );
}

export function drawBudgetItemsSection(doc, presupuesto, items, startY, colors, onNewPage) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const tableX = marginX;
    const tableWidth = pageWidth - marginX * 2;
    const tableRadius = 3;
    const tableTitleGap = 7;

    const primaryColor = colors.primaryColor;
    const secondaryColor = colors.secondaryColor;

    const totalText = formatCurrency(presupuesto.total || 0);

    const tableHeaderColor = secondaryColor.map((channel) =>
        Math.round(channel * 0.8 + 255 * 0.2)
    );

    const tableHeaderTextColor = getReadableTextColor(secondaryColor);
    const isDarkTableHeader =
        tableHeaderTextColor[0] === 255 &&
        tableHeaderTextColor[1] === 255 &&
        tableHeaderTextColor[2] === 255;

    const currentY = startY + pdfTheme.main.sectionGap;
    let tablePageStartY = currentY + tableTitleGap;
    const tableColumns = getBudgetTableColumns(items);
    const quantityColumnIndex = tableColumns.findIndex(
        (column) => column.key === "quantity"
    );
    const totalLabelColumnSpan = tableColumns.length - 2;

    const tableOptions = {
        startY: currentY + tableTitleGap,

        pageBreak: "avoid",
        rowPageBreak: "avoid",
        showFoot: "lastPage",

        margin: {
            left: marginX,
            right: marginX,
            top:
                pdfTheme.page.contentTopAfterHeader +
                tableTitleGap,
            bottom: pdfTheme.page.footerReservedSpace,
        },

        head: [[
            ...tableColumns.map((column) => column.header),
        ]],

        body: items.map((item) =>
            tableColumns.map((column) =>
                column.formatValue(item)
            )
        ),

        foot: [[
            {
                content: "TOTAL",
                colSpan: totalLabelColumnSpan,
                styles: {
                    halign: "right",
                    font: "Inter",
                    fontStyle: "semibold",
                    fontSize: 10,
                    textColor: [107, 114, 128],
                },
            },
            {
                content: totalText,
                colSpan: 2,
                styles: {
                    halign: "right",
                    font: "Inter",
                    fontStyle: "bold",
                    fontSize: 18,
                    textColor: primaryColor,
                },
            },
        ]],

        theme: "plain",

        styles: {
            font: "Inter",
            fontSize: 10,
            cellPadding: {
                top: 4,
                right: 4,
                bottom: 4,
                left: 4,
            },
            valign: "top",
            lineColor: [243, 244, 246],
            lineWidth: 0,
            overflow: "linebreak",
        },

        headStyles: {
            fillColor: false,
            textColor: isDarkTableHeader ? [255, 255, 255] : [17, 24, 39],
            fontStyle: "bold",
            fontSize: 8.5,
            halign: "right",
            valign: "middle",
            cellPadding: {
                top: 4.5,
                right: 4,
                bottom: 4.5,
                left: 4,
            },
        },

        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [107, 114, 128],
        },

        footStyles: {
            fillColor: false,
            valign: "middle",
            minCellHeight: 20,
            cellPadding: {
                top: 4,
                right: 4,
                bottom: 4,
                left: 4,
            },
            lineColor: [249, 250, 251],
            lineWidth: 0,
        },

        columnStyles:
            getBudgetTableColumnStyles(tableColumns),

        willDrawCell: (data) => {
            if (data.section === "head" && data.column.index === 0) {
                doc.setFillColor(...tableHeaderColor);

                doc.roundedRect(
                    tableX,
                    data.cell.y,
                    tableWidth,
                    data.cell.height,
                    tableRadius,
                    tableRadius,
                    "F"
                );

                doc.rect(
                    tableX,
                    data.cell.y + data.cell.height - tableRadius,
                    tableWidth,
                    tableRadius,
                    "F"
                );
            }

            if (data.section === "foot" && data.column.index === 0) {
                doc.setFillColor(249, 250, 251);

                doc.roundedRect(
                    tableX,
                    data.cell.y,
                    tableWidth,
                    data.cell.height,
                    tableRadius,
                    tableRadius,
                    "F"
                );

                doc.rect(
                    tableX,
                    data.cell.y,
                    tableWidth,
                    tableRadius,
                    "F"
                );
            }
        },

        didParseCell: (data) => {
            if (data.section === "head") {
                data.cell.styles.textColor = isDarkTableHeader
                    ? [255, 255, 255]
                    : [17, 24, 39];

                if (data.column.index === 0) {
                    data.cell.styles.halign = "left";
                }

                if (
                    data.column.index ===
                    quantityColumnIndex
                ) {
                    data.cell.styles.halign = "center";
                }
            }

            if (data.section === "foot") {
                data.cell.styles.valign = "middle";
            }
        },

        didDrawCell: (data) => {
            if (data.section === "body" && data.column.index === 0) {
                doc.setDrawColor(243, 244, 246);
                doc.setLineWidth(0.25);

                doc.line(
                    marginX,
                    data.cell.y + data.cell.height,
                    pageWidth - marginX,
                    data.cell.y + data.cell.height
                );
            }

            if (
                data.section === "foot" &&
                data.cell.raw?.content === totalText
            ) {
                doc.setDrawColor(...primaryColor);
                doc.setLineWidth(0.6);

                doc.line(
                    marginX,
                    data.cell.y,
                    pageWidth - marginX,
                    data.cell.y
                );
            }
        },

        willDrawPage: (data) => {
            const isFirstTablePage =
                data.table.pageNumber === 1;

            if (isFirstTablePage) {
                doc.setFont("Inter", "semibold");
                doc.setFontSize(pdfTheme.main.titleSize);
                doc.setTextColor(...pdfTheme.main.titleColor);

                doc.text(
                    "Detalle del presupuesto",
                    marginX,
                    data.cursor.y - tableTitleGap
                );
            } else {
                data.cursor.y =
                    pdfTheme.page.contentTopAfterHeader;
            }

            tablePageStartY = data.cursor.y;
        },

        didDrawPage: (data) => {
            const tablePageEndY = data.cursor.y;

            if (tablePageEndY > tablePageStartY) {
                doc.setDrawColor(229, 231, 235);
                doc.setLineWidth(0.25);

                doc.roundedRect(
                    tableX,
                    tablePageStartY,
                    tableWidth,
                    tablePageEndY - tablePageStartY,
                    tableRadius,
                    tableRadius,
                    "S"
                );
            }

            onNewPage();
        },
    };

    const measuredTable = __createTable(doc, tableOptions);
    const completeTableHeight =
        measuredTable.getHeadHeight(measuredTable.columns) +
        measuredTable.body.reduce(
            (height, row) => height + row.height,
            0
        ) +
        measuredTable.getFootHeight(measuredTable.columns);
    const fullPageAvailableHeight =
        doc.internal.pageSize.getHeight() -
        (pdfTheme.page.contentTopAfterHeader + tableTitleGap) -
        pdfTheme.page.footerReservedSpace;

    tableOptions.pageBreak =
        completeTableHeight <= fullPageAvailableHeight
            ? "avoid"
            : "auto";

    autoTable(doc, tableOptions);

    return (
        doc.lastAutoTable.finalY +
        pdfTheme.main.tableEndReserve
    );
}

export function drawTimeAndPaymentSection(doc, presupuesto, startY, onNewPage) {
    const hasEstimatedTime = Boolean(presupuesto?.estimatedTime?.trim());
    const hasPaymentTerms = Boolean(presupuesto?.paymentTerms?.trim());

    if (!hasEstimatedTime && !hasPaymentTerms) {
        return startY;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const columnGap = 14;
    const fullContentWidth = pageWidth - marginX * 2;
    const columnWidth = (fullContentWidth - columnGap) / 2;

    const leftX = marginX;
    const rightX = marginX + columnWidth + columnGap;

    const titleY = startY + pdfTheme.main.sectionGap;
    const valueLineHeight = 6;

    const isTwoColumns = hasEstimatedTime && hasPaymentTerms;
    const textWidth = isTwoColumns
        ? columnWidth
        : fullContentWidth;

    const estimatedTimeLines = hasEstimatedTime
        ? splitPlainTextToLines(
            doc,
            presupuesto.estimatedTime,
            textWidth
        )
        : [];

    const paymentTermsLines = hasPaymentTerms
        ? splitPlainTextToLines(
            doc,
            presupuesto.paymentTerms,
            textWidth
        )
        : [];

    const sectionItems = [
        hasEstimatedTime && {
            title: "Tiempo estimado:",
            lines: estimatedTimeLines,
            x: leftX,
        },
        hasPaymentTerms && {
            title: "Condiciones de pago:",
            lines: paymentTermsLines,
            x: isTwoColumns ? rightX : leftX,
        },
    ].filter(Boolean);

    const maxLines = Math.max(
        ...sectionItems.map((item) => item.lines.length),
        1
    );

    const sectionHeight = 8 + maxLines * valueLineHeight;
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxContentY =
        pageHeight - pdfTheme.page.footerReservedSpace;
    const maxSectionHeight =
        maxContentY - pdfTheme.page.contentTopAfterHeader;
    const needsLinePagination =
        sectionHeight > maxSectionHeight;

    let currentY = ensurePageSpace(
        doc,
        titleY,
        needsLinePagination
            ? 8 + valueLineHeight
            : sectionHeight,
        onNewPage
    );

    const currentValueY = currentY + 8;

    const drawTextBlock = (title, lines, x, drawValues = true) => {
        doc.setFont("Inter", "semibold");
        doc.setFontSize(pdfTheme.main.titleSize);
        doc.setTextColor(...pdfTheme.main.titleColor);

        doc.text(title, x, currentY);

        doc.setFont("Inter", "normal");
        doc.setFontSize(pdfTheme.main.valueSize);
        doc.setTextColor(...pdfTheme.main.valueColor);

        if (drawValues) {
            doc.text(lines, x, currentValueY);
        }
    };

    sectionItems.forEach(({ title, lines, x }) =>
        drawTextBlock(title, lines, x, !needsLinePagination)
    );

    if (needsLinePagination) {
        const columns = sectionItems.map(({ lines, x }) => ({ lines, x }));

        return drawPlainTextColumns(
            doc,
            columns,
            currentValueY,
            valueLineHeight,
            onNewPage
        );
    }

    const textLineHeight =
        doc.getLineHeight() / doc.internal.scaleFactor;
    const lastValueY =
        currentValueY +
        (maxLines - 1) * textLineHeight;

    return lastValueY + pdfTheme.main.textEndReserve;
}

export function drawObservationsSection(doc, presupuesto, startY, onNewPage) {
    if (!hasRichTextContent(presupuesto?.observations)) {
        return startY;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const maxWidth = pageWidth - marginX * 2;

    let currentY = startY + pdfTheme.main.sectionGap;

    currentY = ensurePageSpace(
        doc,
        currentY,
        8 + pdfTheme.main.lineHeight,
        onNewPage
    );

    doc.setFont("Inter", "semibold");
    doc.setFontSize(pdfTheme.main.titleSize);
    doc.setTextColor(...pdfTheme.main.titleColor);

    doc.text("Aclaraciones finales:", marginX, currentY);

    currentY += 8;

    const blocks = parseRichTextHtml(presupuesto.observations);

    blocks.forEach((block) => {
        currentY = ensurePageSpace(
            doc,
            currentY,
            pdfTheme.main.lineHeight + 4,
            onNewPage
        );

        currentY = drawRichTextBlock(
            doc,
            block,
            marginX,
            currentY,
            maxWidth,
            onNewPage
        );

        currentY += 2;
    });

    return currentY;
}

export function drawFooter(doc, presupuesto, company, primaryColor, pageNumber, totalPages) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = pdfTheme.page.marginX;

    const footerY = pageHeight - 13;
    const lineY = footerY - 7;
    const isLastPage = pageNumber === totalPages;

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.25);

    doc.line(
        marginX,
        lineY,
        pageWidth - marginX,
        lineY
    );

    if (!isLastPage) {
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.7);

        doc.line(
            marginX,
            lineY,
            marginX + 18,
            lineY
        );
    }

    doc.setFont("Inter", "normal");
    doc.setFontSize(9.3);
    doc.setTextColor(107, 114, 128);

    if (isLastPage) {
        const labelText = "Presupuesto válido hasta:";
        const expirationDateText = formatPdfDate(presupuesto?.fechaVencimiento);
        const gap = 2.5;

        doc.setFont("Inter", "normal");
        doc.setFontSize(9.3);

        const labelWidth = doc.getTextWidth(labelText);

        doc.setFont("Inter", "semibold");
        const dateWidth = doc.getTextWidth(expirationDateText);

        const totalTextWidth = labelWidth + gap + dateWidth;
        const startX = pageWidth / 2 - totalTextWidth / 2;

        doc.setFont("Inter", "normal");
        doc.setTextColor(107, 114, 128);

        doc.text(
            labelText,
            startX,
            footerY
        );

        doc.setFont("Inter", "semibold");
        doc.setTextColor(55, 65, 81);

        doc.text(
            expirationDateText,
            startX + labelWidth + gap,
            footerY
        );

        return;
    }

    doc.text(
        `Presupuesto ${presupuesto?.budgetNumber || "-"}`,
        marginX,
        footerY
    );

    doc.setFont("Inter", "semibold");
    doc.setTextColor(55, 65, 81);

    const companyName = company?.name || "Empresa";
    const companyNameLines = doc
        .splitTextToSize(companyName, 75)
        .slice(0, 1);

    doc.text(
        companyNameLines[0],
        pageWidth - marginX,
        footerY,
        { align: "right" }
    );
}
