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

        doc.text(
            company.email,
            infoTextX,
            companyInfoY
        );
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

            if (isOnlySpace && currentX === startX) return;

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

export function drawJobDescription(doc, presupuesto, startY) {
    if (!presupuesto?.jobDescription) return startY;

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = pdfTheme.page.marginX;
    const maxWidth = pageWidth - marginX * 2;

    let currentY = startY + pdfTheme.main.sectionGap;

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
        currentY = drawRichTextBlock(
            doc,
            block,
            marginX,
            currentY,
            maxWidth
        );

        currentY += 2;
    });

    return currentY + pdfTheme.main.sectionGap;
}