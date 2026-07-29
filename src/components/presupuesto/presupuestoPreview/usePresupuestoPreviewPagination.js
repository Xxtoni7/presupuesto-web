import { useLayoutEffect, useRef, useState } from "react";
import { hasText, PDF_LAYOUT, wrapPlainText } from "./presupuestoPreviewUtils";
import { buildPreviewPages, createEmptyPage } from "./presupuestoPreviewPageBuilder";

function getElementHeight(element) {
    return element?.getBoundingClientRect().height || 0;
}

function measureRichBlocks( measurementElement, blocks, pixelsPerMillimeter,) {
    const blocksById = new Map(
        blocks.map((block) => [block.id, block]),
    );
    const measurements = {};
    const elements = measurementElement.querySelectorAll(
        "[data-rich-block]",
    );

    for (const element of elements) {
        const block = blocksById.get(
            element.dataset.richBlock,
        );

        if (!block) continue;

        const height = getElementHeight(element);
        const contentElement =
            element.querySelector("li") ||
            element.querySelector("[data-rich-content]");
        const computedStyle = contentElement
            ? getComputedStyle(contentElement)
            : null;
        const lineHeight =
            Number.parseFloat(computedStyle?.lineHeight) ||
            PDF_LAYOUT.richLineHeightMm *
                pixelsPerMillimeter;
        const contentHeight = Math.max(lineHeight, height);
        const lineCount = Math.max(
            1,
            Math.ceil(
                (contentHeight - 0.5) / lineHeight,
            ),
        );

        measurements[block.id] = {
            height: lineCount * lineHeight,
            lineHeight,
            lineCount,
        };
    }

    return measurements;
}

function measureTable(measurementElement) {
    const frame = measurementElement.querySelector(
        '[data-measure="table-frame"]',
    );
    const table = frame?.querySelector("table");
    const rowHeights = table
        ? Array.from(
                table.tBodies[0]?.rows || [],
                getElementHeight,
            )
        : [];

    return {
        titleHeight: getElementHeight(
            measurementElement.querySelector(
                '[data-measure="table-title"]',
            ),
        ),
        frameExtra: Math.max(
            0,
            getElementHeight(frame) - getElementHeight(table),
        ),
        headerHeight: getElementHeight(table?.tHead),
        rowHeights,
        footerHeight: getElementHeight(table?.tFoot),
    };
}

function getTimeLines( hasContent, text, column, font ) {
    if (!hasContent) return [];

    return wrapPlainText(
        text,
        column?.clientWidth || 0,
        font,
    );
}

function measureTimeSection({ measurementElement, presupuesto, hasEstimatedTime, hasPaymentTerms, pixelsPerMillimeter }) {
    const estimatedColumn =
        measurementElement.querySelector(
            '[data-time-column="estimated"] p',
        );
    const paymentColumn = measurementElement.querySelector(
        '[data-time-column="payment"] p',
    );
    const sampleColumn = estimatedColumn || paymentColumn;
    const sampleStyle = sampleColumn
        ? getComputedStyle(sampleColumn)
        : null;
    const wrapFont = sampleStyle
        ? `${sampleStyle.fontWeight} ${sampleStyle.fontSize} ${sampleStyle.fontFamily}`
        : "400 16px Inter, sans-serif";
    const hasTimeSection =
        hasEstimatedTime || hasPaymentTerms;
    const timeData = hasTimeSection
        ? {
                estimatedLines: getTimeLines(
                    hasEstimatedTime,
                    presupuesto.estimatedTime,
                    estimatedColumn,
                    wrapFont,
                ),
                paymentLines: getTimeLines(
                    hasPaymentTerms,
                    presupuesto.paymentTerms,
                    paymentColumn,
                    wrapFont,
                ),
            }
        : null;
    const timeTitles = Array.from(
        measurementElement.querySelectorAll(
            '[data-measure="time-title"]',
        ),
    );

    return {
        timeData,
        timeTitleHeight: Math.max(
            ...timeTitles.map(getElementHeight),
            PDF_LAYOUT.timeTitleHeightMm *
                pixelsPerMillimeter,
        ),
        timeLineHeight:
            Number.parseFloat(sampleStyle?.lineHeight) ||
            PDF_LAYOUT.timeLineHeightMm *
                pixelsPerMillimeter,
    };
}

function measurePreviewPages({
    mainElement,
    pageElement,
    measurementElement,
    presupuesto,
    items,
    jobBlocks,
    observationBlocks,
    hasEstimatedTime,
    hasPaymentTerms,
}) {
    const pageWidth =
        pageElement.getBoundingClientRect().width;
    const pixelsPerMillimeter =
        pageWidth / PDF_LAYOUT.pageWidthMm;
    const allRichBlocks = [
        ...jobBlocks,
        ...observationBlocks,
    ];
    const richBlocks = measureRichBlocks(
        measurementElement,
        allRichBlocks,
        pixelsPerMillimeter,
    );
    const timeMeasurement = measureTimeSection({
        measurementElement,
        presupuesto,
        hasEstimatedTime,
        hasPaymentTerms,
        pixelsPerMillimeter,
    });
    const measurements = {
        clientHeight: getElementHeight(
            measurementElement.querySelector(
                '[data-measure="client"]',
            ),
        ),
        sectionTitleHeight: getElementHeight(
            measurementElement.querySelector(
                '[data-measure="section-title"]',
            ),
        ),
        richBlocks,
        table: measureTable(measurementElement),
        timeTitleHeight: timeMeasurement.timeTitleHeight,
        timeLineHeight: timeMeasurement.timeLineHeight,
    };

    return buildPreviewPages({
        pageHeight: mainElement.clientHeight,
        pixelsPerMillimeter,
        measurements,
        jobBlocks,
        observationBlocks,
        items,
        timeData: timeMeasurement.timeData,
    });
}

export function usePresupuestoPreviewPagination({ company, presupuesto, items, jobBlocks, observationBlocks }) {
    const headerRef = useRef(null);
    const mainRef = useRef(null);
    const pageRef = useRef(null);
    const measurementRef = useRef(null);
    const [pages, setPages] = useState([createEmptyPage(1)]);
    const hasEstimatedTime = hasText(
        presupuesto.estimatedTime,
    );
    const hasPaymentTerms = hasText(
        presupuesto.paymentTerms,
    );

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

            setPages(
                measurePreviewPages({
                    mainElement,
                    pageElement,
                    measurementElement,
                    presupuesto,
                    items,
                    jobBlocks,
                    observationBlocks,
                    hasEstimatedTime,
                    hasPaymentTerms,
                }),
            );
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

    return {
        pages,
        headerRef,
        mainRef,
        pageRef,
        measurementRef,
    };
}
