import PropTypes from "prop-types";
import { MapPin, User } from "lucide-react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { getPreviewTableHeaderColor, hasText, PDF_LAYOUT, PDF_TABLE_LAYOUT } from "./presupuestoPreviewUtils";

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

function hasItemCost(items, field) {
    return items.some((item) => {
        const value = Number(item[field]);

        return Number.isFinite(value) && value !== 0;
    });
}

function getBudgetTableVisibility(items) {
    return {
        showMaterials: hasItemCost(items, "materials"),
        showLabor: hasItemCost(items, "labor"),
    };
}

function BudgetTableColGroup({
    showMaterials,
    showLabor,
}) {
    const descriptionWidth =
        55 + (showMaterials ? 0 : 30) + (showLabor ? 0 : 32);

    return (
        <colgroup>
            <col style={{ width: `${descriptionWidth}mm` }} />
            {showMaterials && (
                <col style={{ width: "30mm" }} />
            )}
            {showLabor && <col style={{ width: "32mm" }} />}
            <col style={{ width: "19mm" }} />
            <col style={{ width: "34mm" }} />
        </colgroup>
    );
}

function BudgetTableHeader({
    secondaryColor,
    headerTextColor,
    showMaterials,
    showLabor,
}) {
    const headers = [
        {
            key: "description",
            label: "Descripción",
            textAlign: "left",
        },
        ...(showMaterials
            ? [
                    {
                        key: "materials",
                        label: "Materiales",
                        textAlign: "right",
                    },
                ]
            : []),
        ...(showLabor
            ? [
                    {
                        key: "labor",
                        label: "Mano de obra",
                        textAlign: "right",
                    },
                ]
            : []),
        {
            key: "quantity",
            label: "Cant",
            textAlign: "center",
        },
        {
            key: "subtotal",
            label: "Subtotal",
            textAlign: "right",
        },
    ];

    return (
        <thead
            style={{
                backgroundColor:
                    getPreviewTableHeaderColor(secondaryColor),
            }}
        >
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        className="font-bold"
                        style={{
                            color: headerTextColor,
                            fontSize: `${PDF_TABLE_LAYOUT.headerFontSizePt}pt`,
                            lineHeight: `${PDF_TABLE_LAYOUT.headerFontSizePt * PDF_TABLE_LAYOUT.lineHeightFactor}pt`,
                            padding: `${PDF_TABLE_LAYOUT.headerVerticalPaddingMm}mm ${PDF_TABLE_LAYOUT.cellPaddingMm}mm`,
                            textAlign: header.textAlign,
                            verticalAlign: "middle",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {header.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

function BudgetTableRow({
    item,
    showMaterials,
    showLabor,
}) {
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

            {showMaterials && (
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
            )}

            {showLabor && (
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
            )}

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

function BudgetTableFooter({
    total,
    primaryColor,
    showMaterials,
    showLabor,
}) {
    const labelColumnSpan =
        1 + Number(showMaterials) + Number(showLabor);

    return (
        <tfoot>
            <tr
                className="bg-gray-50"
                style={{
                    height: `${PDF_TABLE_LAYOUT.footerHeightMm}mm`,
                }}
            >
                <td
                    colSpan={labelColumnSpan}
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

function BudgetTableFrame({
    presupuesto,
    items,
    rowIndexes,
    showTotal,
    secondaryColor,
    headerTextColor,
    primaryColor,
    measureTable,
}) {
    const { showMaterials, showLabor } =
        getBudgetTableVisibility(items);

    return (
        <div
            data-measure={measureTable ? "table-frame" : undefined}
            className="relative overflow-hidden bg-white"
            style={{
                borderRadius: `${PDF_TABLE_LAYOUT.radiusMm}mm`,
            }}
        >
            <table className="w-full table-fixed">
                <BudgetTableColGroup
                    showMaterials={showMaterials}
                    showLabor={showLabor}
                />

                <BudgetTableHeader
                    secondaryColor={secondaryColor}
                    headerTextColor={headerTextColor}
                    showMaterials={showMaterials}
                    showLabor={showLabor}
                />

                <tbody className="bg-white">
                    {rowIndexes.map((rowIndex) => (
                        <BudgetTableRow
                            key={
                                items[rowIndex].idItem ?? rowIndex
                            }
                            item={items[rowIndex]}
                            showMaterials={showMaterials}
                            showLabor={showLabor}
                        />
                    ))}
                </tbody>

                {showTotal && (
                    <BudgetTableFooter
                        total={presupuesto.total}
                        primaryColor={primaryColor}
                        showMaterials={showMaterials}
                        showLabor={showLabor}
                    />
                )}
            </table>

            <BudgetTableOutline />
        </div>
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

            <BudgetTableFrame
                presupuesto={presupuesto}
                items={items}
                rowIndexes={rowIndexes}
                showTotal={showTotal}
                secondaryColor={secondaryColor}
                headerTextColor={headerTextColor}
                primaryColor={primaryColor}
            />
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

export function MeasurementContent({
    measurementRef,
    presupuesto,
    items,
    jobBlocks,
    observationBlocks,
    secondaryColor,
    headerTextColor,
    primaryColor,
}) {
    const allRowIndexes = items.map((_, index) => index);

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

            <BudgetTableFrame
                presupuesto={presupuesto}
                items={items}
                rowIndexes={allRowIndexes}
                showTotal
                secondaryColor={secondaryColor}
                headerTextColor={headerTextColor}
                primaryColor={primaryColor}
                measureTable
            />

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

function PreviewElement({
    element,
    presupuesto,
    items,
    secondaryColor,
    headerTextColor,
    primaryColor,
}) {
    const style = {
        marginTop: `${element.gap || 0}px`,
    };

    if (element.type === "client") {
        return (
            <div style={style}>
                <ClientSection presupuesto={presupuesto} />
            </div>
        );
    }

    if (element.type === "sectionTitle") {
        return (
            <div style={style}>
                <SectionTitle>{element.text}</SectionTitle>
            </div>
        );
    }

    if (element.type === "richBlock") {
        return (
            <div style={style}>
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
            <div style={style}>
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
            <div style={style}>
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
}

export function PreviewPageContent({
    elements,
    presupuesto,
    items,
    secondaryColor,
    headerTextColor,
    primaryColor,
}) {
    return elements.map((element, elementIndex) => (
        <PreviewElement
            key={
                element.type === "richBlock"
                    ? `${element.block.id}-${elementIndex}`
                    : `${element.type}-${elementIndex}`
            }
            element={element}
            presupuesto={presupuesto}
            items={items}
            secondaryColor={secondaryColor}
            headerTextColor={headerTextColor}
            primaryColor={primaryColor}
        />
    ));
}

const richBlockPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    number: PropTypes.number,
    html: PropTypes.string.isRequired,
});

const itemPropType = PropTypes.shape({
    idItem: PropTypes.number,
    description: PropTypes.string,
    materials: PropTypes.number,
    labor: PropTypes.number,
    quantity: PropTypes.number,
    subtotal: PropTypes.number,
});

const presupuestoPropType = PropTypes.shape({
    clientName: PropTypes.string,
    workAddress: PropTypes.string,
    estimatedTime: PropTypes.string,
    paymentTerms: PropTypes.string,
    total: PropTypes.number,
});

MeasurementContent.propTypes = {
    measurementRef: PropTypes.shape({
        current: PropTypes.any,
    }),
    presupuesto: presupuestoPropType.isRequired,
    items: PropTypes.arrayOf(itemPropType).isRequired,
    jobBlocks: PropTypes.arrayOf(richBlockPropType).isRequired,
    observationBlocks:
        PropTypes.arrayOf(richBlockPropType).isRequired,
    secondaryColor: PropTypes.string.isRequired,
    headerTextColor: PropTypes.string.isRequired,
    primaryColor: PropTypes.string.isRequired,
};

PreviewPageContent.propTypes = {
    elements: PropTypes.arrayOf(PropTypes.object).isRequired,
    presupuesto: presupuestoPropType.isRequired,
    items: PropTypes.arrayOf(itemPropType).isRequired,
    secondaryColor: PropTypes.string.isRequired,
    headerTextColor: PropTypes.string.isRequired,
    primaryColor: PropTypes.string.isRequired,
};
