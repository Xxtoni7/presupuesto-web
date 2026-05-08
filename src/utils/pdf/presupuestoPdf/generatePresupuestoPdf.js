import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../../formatCurrency";
import { registerInterFonts } from "./pdfFonts";
import { getImageUrl, hexToRgb, loadImageElement, loadSvgAsPngDataUrl, sanitizeFileName } from "./pdfHelpers";
import { drawClientInfo, drawHeader, drawJobDescription } from "./pdfSections";

export async function generatePresupuestoPdf(presupuesto, company, items) {
    const doc = new jsPDF();
    await registerInterFonts(doc);

    const primaryColor = hexToRgb(company?.colorMain);
    const logoImage = await loadImageElement(getImageUrl(company?.logoUrl));
    const headerIcons = {
        phone: await loadSvgAsPngDataUrl("/icons/pdf/phone.svg", 24),
        mail: await loadSvgAsPngDataUrl("/icons/pdf/mail.svg", 24),
        calendar: await loadSvgAsPngDataUrl("/icons/pdf/calendar.svg", 24),
    };
    const secondaryColor = hexToRgb(company?.colorSecondary, [254, 226, 226]);

    const tableHeaderColor = secondaryColor.map((channel) =>
        Math.round(channel * 0.8 + 255 * 0.2)
    );

    drawHeader(
        doc,
        company,
        presupuesto,
        primaryColor,
        logoImage,
        headerIcons
    );

    let currentY = drawClientInfo(doc, presupuesto);

    currentY = drawJobDescription(doc, presupuesto, currentY);

    autoTable(doc, {
        startY: currentY + 12,

        margin: {
            left: 20,
            right: 20,
        },

        head: [[
            "Descripción",
            "Materiales",
            "Mano de obra",
            "Cant.",
            "Subtotal",
        ]],

        body: items.map((item) => [
            item.description || "-",
            formatCurrency(item.materials || 0),
            formatCurrency(item.labor || 0),
            item.quantity || 0,
            formatCurrency(item.subtotal || 0),
        ]),

        styles: {
            font: "Inter",
            fontSize: 9,
            cellPadding: 4,
            valign: "top",
            textColor: [107, 114, 128],
            lineColor: [243, 244, 246],
            lineWidth: 0.2,
            overflow: "linebreak",
        },

        headStyles: {
            fillColor: tableHeaderColor,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8,
            halign: "right",
            valign: "middle",
        },

        bodyStyles: {
            fillColor: [255, 255, 255],
        },

        columnStyles: {
            0: {
                cellWidth: 75,
                halign: "left",
                fontSize: 10,
                textColor: [31, 41, 55],
            },
            1: {
                halign: "right",
                textColor: [107, 114, 128],
            },
            2: {
                halign: "right",
                textColor: [107, 114, 128],
            },
            3: {
                halign: "center",
                fontStyle: "bold",
                textColor: [107, 114, 128],
            },
            4: {
                halign: "right",
                fontStyle: "bold",
                fontSize: 10,
                textColor: [17, 24, 39],
            },
        },
    });

    const finalY = doc.lastAutoTable.finalY + 14;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.7);

    doc.line(
        20,
        finalY - 7,
        pageWidth - 20,
        finalY - 7
    );

    doc.setFillColor(249, 250, 251);

    doc.rect(
        20,
        finalY - 3,
        pageWidth - 40,
        18,
        "F"
    );

    doc.setFont("Inter", "bold");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);

    doc.text(
        "TOTAL",
        pageWidth - 72,
        finalY + 8
    );

    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);

    doc.text(
        formatCurrency(presupuesto.total || 0),
        pageWidth - 20,
        finalY + 8,
        { align: "right" }
    );

    const fileName = `Presupuesto_${sanitizeFileName(
        presupuesto.clientName
    )}.pdf`;

    doc.save(fileName);
}