import autoTable from "jspdf-autotable";

import { formatCurrency } from "../../formatCurrency";
import { pdfTheme } from "./pdfTheme";
import { formatPdfDate, parseRichTextHtml } from "./pdfHelpers";

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

    if (logoImage) {
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
    }

    const companyTextX = logoBoxX + logoBoxWidth + 6;

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

function drawInlineSegments(doc, segments, startX, startY, maxWidth) {
    let currentX = startX;
    let currentY = startY;

    const lineHeight = pdfTheme.main.lineHeight;
    const endX = startX + maxWidth;

    segments.forEach((segment) => {
        const parts = segment.text
            .replaceAll("\n", " \n ")
            .split(/(\s+)/);

        parts.forEach((part) => {
            if (!part) return;

            if (part === "\n") {
                currentX = startX;
                currentY += lineHeight;
                return;
            }

            doc.setFont("Inter", getSegmentFontStyle(segment));
            doc.setFontSize(pdfTheme.main.valueSize);

            const partWidth = doc.getTextWidth(part);
            const isOnlySpace = part.trim() === "";

            if (!isOnlySpace && currentX + partWidth > endX) {
                currentX = startX;
                currentY += lineHeight;
            }

            drawTextWithStyle(
                doc,
                part,
                currentX,
                currentY,
                segment
            );

            currentX += partWidth;
        });
    });

    return currentY + lineHeight;
}

function drawRichTextBlock(doc, block, startX, startY, maxWidth) {
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
        contentWidth
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

function drawPlainTextLines(doc, lines, startX, startY, lineHeight, onNewPage) {
    let currentY = startY;

    lines.forEach((line) => {
        currentY = ensurePageSpace(
            doc,
            currentY,
            lineHeight,
            onNewPage
        );

        if (line !== "") {
            doc.text(
                line,
                startX,
                currentY
            );
        }

        currentY += lineHeight;
    });

    return currentY;
}

export function drawJobDescription(doc, presupuesto, startY, onNewPage) {
    if (!presupuesto?.jobDescription) return startY;

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

    doc.text(
        "Descripción del trabajo:",
        marginX,
        currentY
    );

    currentY += 8;

    const blocks = parseRichTextHtml(presupuesto.jobDescription);

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
            maxWidth
        );

        currentY += 2;
    });

    return currentY;
}

export function drawBudgetItemsSection(doc, presupuesto, items, startY, colors, onNewPage) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const tableX = marginX;
    const tableWidth = pageWidth - marginX * 2;
    const tableRadius = 3;

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

    let currentY = startY + pdfTheme.main.sectionGap;

    const estimatedBudgetSectionHeight =
        18 + // título
        16 + // header tabla
        items.length * 18 + // filas aproximadas
        30; // total

    currentY = ensurePageSpace(
        doc,
        currentY,
        estimatedBudgetSectionHeight,
        onNewPage
    );

    doc.setFont("Inter", "semibold");
    doc.setFontSize(pdfTheme.main.titleSize);
    doc.setTextColor(...pdfTheme.main.titleColor);

    doc.text(
        "Detalle del presupuesto",
        marginX,
        currentY
    );

    autoTable(doc, {
        startY: currentY + 7,

        pageBreak: "avoid",
        rowPageBreak: "avoid",

        margin: {
            left: marginX,
            right: marginX,
            top: pdfTheme.page.contentTopAfterHeader,
            bottom: pdfTheme.page.footerReservedSpace,
        },

        head: [[
            "Descripción",
            "Materiales",
            "Mano de obra",
            "Cant",
            "Subtotal",
        ]],

        body: items.map((item) => [
            item.description || "-",
            formatCurrency(item.materials || 0),
            formatCurrency(item.labor || 0),
            item.quantity || 0,
            formatCurrency(item.subtotal || 0),
        ]),

        foot: [[
            {
                content: "TOTAL",
                colSpan: 3,
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

        columnStyles: {
            0: {
                cellWidth: 55,
                halign: "left",
                fontSize: 11,
                textColor: [31, 41, 55],
            },
            1: {
                cellWidth: 30,
                halign: "right",
                valign: "middle",
                fontSize: 9.5,
                textColor: [107, 114, 128],
            },
            2: {
                cellWidth: 32,
                halign: "right",
                valign: "middle",
                fontSize: 9.5,
                textColor: [107, 114, 128],
            },
            3: {
                cellWidth: 19,
                halign: "center",
                valign: "middle",
                fontSize: 9.5,
                fontStyle: "medium",
                textColor: [75, 85, 99],
            },
            4: {
                cellWidth: 34,
                halign: "right",
                valign: "middle",
                fontSize: 9.5,
                fontStyle: "semibold",
                textColor: [17, 24, 39],
            },
        },

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

                if (data.column.index === 3) {
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

        didDrawPage: () => {
            onNewPage();
        },
    });

    const tableStartY = currentY + 7;
    const tableEndY = doc.lastAutoTable.finalY;

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.25);

    doc.roundedRect(
        tableX,
        tableStartY,
        tableWidth,
        tableEndY - tableStartY,
        tableRadius,
        tableRadius,
        "S"
    );

    return doc.lastAutoTable.finalY + pdfTheme.main.sectionGap;
}

export function drawTimeAndPaymentSection(doc, presupuesto, startY, onNewPage) {
    if (!presupuesto?.estimatedTime && !presupuesto?.paymentTerms) {
        return startY;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const columnGap = 14;
    const columnWidth = (pageWidth - marginX * 2 - columnGap) / 2;

    const leftX = marginX;
    const rightX = marginX + columnWidth + columnGap;

    const titleY = startY + pdfTheme.main.sectionGap;
    const valueLineHeight = 6;

    const estimatedTimeLines = presupuesto?.estimatedTime
        ? doc.splitTextToSize(presupuesto.estimatedTime, columnWidth)
        : [];

    const paymentTermsLines = presupuesto?.paymentTerms
        ? doc.splitTextToSize(presupuesto.paymentTerms, columnWidth)
        : [];

    const maxLines = Math.max(
        estimatedTimeLines.length,
        paymentTermsLines.length,
        1
    );

    const estimatedSectionHeight = 8 + maxLines * valueLineHeight + 4;

    let currentY = ensurePageSpace(
        doc,
        titleY,
        estimatedSectionHeight,
        onNewPage
    );

    const currentValueY = currentY + 8;

    if (presupuesto?.estimatedTime) {
        doc.setFont("Inter", "semibold");
        doc.setFontSize(pdfTheme.main.titleSize);
        doc.setTextColor(...pdfTheme.main.titleColor);

        doc.text(
            "Tiempo estimado:",
            leftX,
            currentY
        );

        doc.setFont("Inter", "normal");
        doc.setFontSize(pdfTheme.main.valueSize);
        doc.setTextColor(...pdfTheme.main.valueColor);

        doc.text(
            estimatedTimeLines,
            leftX,
            currentValueY
        );
    }

    if (presupuesto?.paymentTerms) {
        doc.setFont("Inter", "semibold");
        doc.setFontSize(pdfTheme.main.titleSize);
        doc.setTextColor(...pdfTheme.main.titleColor);

        doc.text(
            "Condiciones de pago:",
            rightX,
            currentY
        );

        doc.setFont("Inter", "normal");
        doc.setFontSize(pdfTheme.main.valueSize);
        doc.setTextColor(...pdfTheme.main.valueColor);

        doc.text(
            paymentTermsLines,
            rightX,
            currentValueY
        );
    }

    return currentValueY + maxLines * valueLineHeight;
}

export function drawObservationsSection(doc, presupuesto, startY, onNewPage) {
    if (!presupuesto?.observations) {
        return startY;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const maxWidth = pageWidth - marginX * 2;

    let currentY = startY + pdfTheme.main.sectionGap;

    const observationLines = splitPlainTextToLines(
        doc,
        presupuesto.observations,
        maxWidth
    );

    const estimatedSectionHeight =
        8 + observationLines.length * pdfTheme.main.lineHeight;

    currentY = ensurePageSpace(
        doc,
        currentY,
        estimatedSectionHeight,
        onNewPage
    );

    doc.setFont("Inter", "semibold");
    doc.setFontSize(pdfTheme.main.titleSize);
    doc.setTextColor(...pdfTheme.main.titleColor);

    doc.text(
        "Observaciones:",
        marginX,
        currentY
    );

    currentY += 8;

    doc.setFont("Inter", "normal");
    doc.setFontSize(pdfTheme.main.valueSize);
    doc.setTextColor(...pdfTheme.main.valueColor);

    currentY = drawPlainTextLines(
        doc,
        observationLines,
        marginX,
        currentY,
        pdfTheme.main.lineHeight,
        onNewPage
    );

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