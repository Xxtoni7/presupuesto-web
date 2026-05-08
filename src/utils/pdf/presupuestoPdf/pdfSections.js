import { pdfTheme } from "./pdfTheme";
import { formatPdfDate } from "./pdfHelpers";

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

export function drawClientInfo(doc, presupuesto) {
    let currentY = 68;

    doc.setFont("Inter", "bold");
    doc.setFontSize(pdfTheme.font.subtitle);
    doc.setTextColor(...pdfTheme.colors.text);

    doc.text(
        "Cliente",
        pdfTheme.page.marginX,
        currentY
    );

    currentY += 10;

    doc.setFont("Inter", "normal");
    doc.setFontSize(pdfTheme.font.body);
    doc.setTextColor(...pdfTheme.colors.text);

    doc.text(
        `Nombre: ${presupuesto?.clientName || "-"}`,
        pdfTheme.page.marginX,
        currentY
    );

    currentY += 8;

    if (presupuesto?.workAddress) {
        doc.text(
            `Dirección: ${presupuesto.workAddress}`,
            pdfTheme.page.marginX,
            currentY
        );

        currentY += 8;
    }

    return currentY;
}

export function drawJobDescription(doc, presupuesto, startY) {
    if (!presupuesto?.jobDescription) return startY;

    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - pdfTheme.page.marginX * 2;

    let currentY = startY + 10;

    doc.setFont("Inter", "bold");
    doc.setFontSize(pdfTheme.font.body);
    doc.setTextColor(...pdfTheme.colors.text);

    doc.text(
        "Descripción del trabajo:",
        pdfTheme.page.marginX,
        currentY
    );

    currentY += 7;

    doc.setFont("Inter", "normal");
    doc.setFontSize(pdfTheme.font.body);
    doc.setTextColor(...pdfTheme.colors.text);

    const plainText = presupuesto.jobDescription
        .replaceAll(/<[^>]+>/g, "")
        .replaceAll("&nbsp;", " ")
        .trim();

    const lines = doc.splitTextToSize(plainText, maxWidth);

    doc.text(lines, pdfTheme.page.marginX, currentY);

    return currentY + lines.length * 6;
}