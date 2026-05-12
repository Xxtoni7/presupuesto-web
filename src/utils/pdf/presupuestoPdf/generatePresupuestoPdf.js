import jsPDF from "jspdf";
import { registerInterFonts } from "./pdfFonts";
import { getImageUrl, hexToRgb, loadImageElement, loadSvgAsPngDataUrl, sanitizeFileName } from "./pdfHelpers";
import { drawBudgetItemsSection, drawClientInfo, drawHeader, drawJobDescription, drawTimeAndPaymentSection, drawObservationsSection, } from "./pdfSections";

export async function generatePresupuestoPdf(presupuesto, company, items) {
    const doc = new jsPDF();
    await registerInterFonts(doc);

    const primaryColor = hexToRgb(company?.colorMain);
    const secondaryColor = hexToRgb(company?.colorSecondary, [254, 226, 226]);

    const logoImage = await loadImageElement(getImageUrl(company?.logoUrl));

    const pdfIcons = {
        phone: await loadSvgAsPngDataUrl("/icons/pdf/phone.svg", 24),
        mail: await loadSvgAsPngDataUrl("/icons/pdf/mail.svg", 24),
        calendar: await loadSvgAsPngDataUrl("/icons/pdf/calendar.svg", 24),
        user: await loadSvgAsPngDataUrl("/icons/pdf/user.svg", 24),
        mapPin: await loadSvgAsPngDataUrl("/icons/pdf/map-pin.svg", 24),
    };

    const drawPageHeader = () => {
        drawHeader(
            doc,
            company,
            presupuesto,
            primaryColor,
            logoImage,
            pdfIcons
        );
    };

    drawPageHeader();

    let currentY = drawClientInfo(doc, presupuesto, pdfIcons);

    currentY = drawJobDescription(
        doc,
        presupuesto,
        currentY,
        drawPageHeader
    );

    currentY = drawBudgetItemsSection(
        doc,
        presupuesto,
        items,
        currentY,
        {
            primaryColor,
            secondaryColor,
        },
        drawPageHeader
    );

    currentY = drawTimeAndPaymentSection(
        doc,
        presupuesto,
        currentY,
        drawPageHeader
    );

    currentY = drawObservationsSection(
        doc,
        presupuesto,
        currentY,
        drawPageHeader
    );

    const fileName = `Presupuesto_${sanitizeFileName(
        presupuesto.clientName
    )}.pdf`;

    doc.save(fileName);
}