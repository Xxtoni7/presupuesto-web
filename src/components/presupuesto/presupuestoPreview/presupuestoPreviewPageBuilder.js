import { PDF_LAYOUT } from "./presupuestoPreviewUtils";

export function createEmptyPage(pageNumber) {
    return {
        id: `preview-page-${pageNumber}`,
        elements: [],
    };
}

function createPaginationState(
    pageHeight,
    pixelsPerMillimeter,
) {
    return {
        pageHeight,
        pixelsPerMillimeter,
        pages: [createEmptyPage(1)],
        pageIndex: 0,
        usedHeight: 0,
    };
}

function getCurrentPage(state) {
    return state.pages[state.pageIndex];
}

function startNewPage(state) {
    state.pages.push(
        createEmptyPage(state.pages.length + 1),
    );
    state.pageIndex += 1;
    state.usedHeight = 0;
}

function getRichPageHeight(state) {
    const baselineOffset =
        state.pageIndex > 0
            ? PDF_LAYOUT.paginationBaselineOffsetMm *
                state.pixelsPerMillimeter
            : 0;

    return state.pageHeight - baselineOffset;
}

function addElement(state, element, height, gap = 0) {
    const shouldStartNewPage =
        state.usedHeight > 0 &&
        state.usedHeight + gap + height > state.pageHeight;

    if (shouldStartNewPage) {
        startNewPage(state);
    }

    const appliedGap = shouldStartNewPage ? 0 : gap;

    getCurrentPage(state).elements.push({
        ...element,
        gap: appliedGap,
        height,
    });
    state.usedHeight += appliedGap + height;
}

function getRichSliceLineCount(
    state,
    lineHeight,
    remainingLines,
) {
    const availableLines = Math.floor(
        (getRichPageHeight(state) -
            state.usedHeight +
            0.5) /
            lineHeight,
    );

    if (availableLines >= 1) {
        return Math.min(availableLines, remainingLines);
    }

    return state.usedHeight > 0 ? 0 : 1;
}

function addRichBlock(
    state,
    richBlockMeasurements,
    block,
) {
    const measurement = richBlockMeasurements[block.id];

    if (!measurement) return;

    const { lineCount, lineHeight } = measurement;
    const minimumReserve =
        (PDF_LAYOUT.richLineHeightMm +
            PDF_LAYOUT.richBlockExtraMm) *
        state.pixelsPerMillimeter;
    const blockGap =
        PDF_LAYOUT.richBlockGapMm *
        state.pixelsPerMillimeter;
    let lineIndex = 0;

    while (lineIndex < lineCount) {
        const availableHeight =
            getRichPageHeight(state) - state.usedHeight;
        const neededHeight =
            lineIndex === 0 ? minimumReserve : lineHeight;

        if (
            state.usedHeight > 0 &&
            availableHeight + 0.5 < neededHeight
        ) {
            startNewPage(state);
            continue;
        }

        const linesInSlice = getRichSliceLineCount(
            state,
            lineHeight,
            lineCount - lineIndex,
        );

        if (linesInSlice === 0) {
            startNewPage(state);
            continue;
        }

        const sliceOffset = lineIndex * lineHeight;
        const sliceHeight = linesInSlice * lineHeight;
        const isLastSlice =
            lineIndex + linesInSlice === lineCount;
        const afterGap = isLastSlice ? blockGap : 0;

        getCurrentPage(state).elements.push({
            type: "richBlock",
            block,
            gap: 0,
            height: sliceHeight + afterGap,
            sliceOffset,
            sliceHeight,
            afterGap,
        });
        state.usedHeight += sliceHeight + afterGap;
        lineIndex += linesInSlice;

        if (lineIndex < lineCount) {
            startNewPage(state);
        }
    }
}

function addRichSection(
    state,
    measurements,
    blocks,
    { title, startReserveMm, gap },
) {
    if (blocks.length === 0) return;

    const minimumReserve =
        (PDF_LAYOUT.richLineHeightMm +
            PDF_LAYOUT.richBlockExtraMm) *
        state.pixelsPerMillimeter;
    const firstBlockHeight =
        measurements.richBlocks[blocks[0].id]?.height || 0;
    const neededHeight = Math.max(
        startReserveMm * state.pixelsPerMillimeter,
        measurements.sectionTitleHeight +
            Math.min(firstBlockHeight, minimumReserve),
    );
    let appliedGap = gap;

    if (
        state.usedHeight > 0 &&
        state.usedHeight + appliedGap + neededHeight >
            state.pageHeight
    ) {
        startNewPage(state);
        appliedGap = 0;
    }

    addElement(
        state,
        { type: "sectionTitle", text: title },
        measurements.sectionTitleHeight,
        appliedGap,
    );

    for (const block of blocks) {
        addRichBlock(
            state,
            measurements.richBlocks,
            block,
        );
    }
}

function getCompleteTableHeight(table) {
    const rowsHeight = table.rowHeights.reduce(
        (sum, height) => sum + height,
        0,
    );

    return (
        table.titleHeight +
        table.frameExtra +
        table.headerHeight +
        rowsHeight +
        table.footerHeight
    );
}

function keepCompleteTableTogether(
    state,
    table,
    tableState,
) {
    const completeHeight = getCompleteTableHeight(table);

    if (
        state.usedHeight > 0 &&
        completeHeight <= state.pageHeight &&
        state.usedHeight +
            tableState.tableGap +
            completeHeight >
            state.pageHeight
    ) {
        startNewPage(state);
        tableState.tableGap = 0;
    }
}

function prepareTableSegment(state, table, tableState) {
    const titleHeight = tableState.firstPage
        ? table.titleHeight
        : 0;
    let gap = tableState.firstPage
        ? tableState.tableGap
        : 0;
    const fixedHeight =
        titleHeight +
        table.frameExtra +
        table.headerHeight;

    if (
        state.usedHeight > 0 &&
        state.usedHeight + gap + fixedHeight >
            state.pageHeight
    ) {
        startNewPage(state);
        gap = 0;
    }

    return {
        gap,
        fixedHeight,
        availableRowsHeight:
            state.pageHeight -
            state.usedHeight -
            gap -
            fixedHeight,
    };
}

function collectTableRows(
    state,
    table,
    items,
    tableState,
    segment,
) {
    const rowIndexes = [];
    let rowsHeight = 0;

    if (tableState.totalPending) {
        return { rowIndexes, rowsHeight, retry: false };
    }

    while (tableState.rowIndex < items.length) {
        const rowIndex = tableState.rowIndex;
        const rowHeight = table.rowHeights[rowIndex];
        const isLastRow = rowIndex === items.length - 1;
        const neededHeight =
            rowHeight +
            (isLastRow ? table.footerHeight : 0);

        if (
            rowsHeight + neededHeight <=
            segment.availableRowsHeight + 0.5
        ) {
            rowIndexes.push(rowIndex);
            rowsHeight += rowHeight;
            tableState.rowIndex += 1;
            continue;
        }

        if (rowIndexes.length > 0) break;

        if (state.usedHeight > 0 || segment.gap > 0) {
            startNewPage(state);
            tableState.tableGap = 0;
            return { rowIndexes, rowsHeight, retry: true };
        }

        rowIndexes.push(rowIndex);
        rowsHeight += rowHeight;
        tableState.rowIndex += 1;
        break;
    }

    return { rowIndexes, rowsHeight, retry: false };
}

function resolveTableTotal(
    table,
    itemCount,
    tableState,
    rowsHeight,
    availableRowsHeight,
) {
    if (
        !tableState.totalPending &&
        tableState.rowIndex < itemCount
    ) {
        return false;
    }

    const occupiedHeight = tableState.totalPending
        ? 0
        : rowsHeight;
    const showTotal =
        occupiedHeight + table.footerHeight <=
        availableRowsHeight + 0.5;
    tableState.totalPending = !showTotal;

    return showTotal;
}

function hasPendingTableContent(tableState, itemCount) {
    return (
        tableState.rowIndex < itemCount ||
        tableState.totalPending ||
        tableState.firstPage
    );
}

function addTableSection(
    state,
    table,
    items,
    sectionGap,
) {
    const tableState = {
        tableGap: sectionGap,
        rowIndex: 0,
        firstPage: true,
        totalPending: false,
    };
    keepCompleteTableTogether(state, table, tableState);

    do {
        const segment = prepareTableSegment(
            state,
            table,
            tableState,
        );
        const rows = collectTableRows(
            state,
            table,
            items,
            tableState,
            segment,
        );

        if (rows.retry) continue;

        const showTotal = resolveTableTotal(
            table,
            items.length,
            tableState,
            rows.rowsHeight,
            segment.availableRowsHeight,
        );
        const segmentHeight =
            segment.fixedHeight +
            rows.rowsHeight +
            (showTotal ? table.footerHeight : 0);

        getCurrentPage(state).elements.push({
            type: "table",
            gap: segment.gap,
            height: segmentHeight,
            showTitle: tableState.firstPage,
            rowIndexes: rows.rowIndexes,
            showTotal,
        });
        state.usedHeight += segment.gap + segmentHeight;
        tableState.firstPage = false;

        if (
            hasPendingTableContent(
                tableState,
                items.length,
            )
        ) {
            startNewPage(state);
        }
    } while (
        hasPendingTableContent(tableState, items.length)
    );
}

function addPaginatedTimeSection(
    state,
    measurements,
    timeData,
    maxLines,
    initialGap,
) {
    const { timeLineHeight, timeTitleHeight } =
        measurements;
    let gap = initialGap;
    let lineIndex = 0;
    let firstSegment = true;

    while (lineIndex < maxLines) {
        const titleHeight = firstSegment
            ? timeTitleHeight
            : 0;

        if (
            state.usedHeight > 0 &&
            state.usedHeight +
                gap +
                titleHeight +
                timeLineHeight >
                state.pageHeight
        ) {
            startNewPage(state);
            gap = 0;
        }

        const availableHeight =
            state.pageHeight -
            state.usedHeight -
            gap -
            titleHeight;
        const lineCount = Math.max(
            1,
            Math.min(
                maxLines - lineIndex,
                Math.floor(
                    availableHeight / timeLineHeight,
                ),
            ),
        );
        const segmentHeight =
            titleHeight + lineCount * timeLineHeight;

        getCurrentPage(state).elements.push({
            type: "time",
            gap,
            height: segmentHeight,
            showTitles: firstSegment,
            startLine: lineIndex,
            lineCount,
            timeData,
        });
        state.usedHeight += gap + segmentHeight;
        lineIndex += lineCount;
        firstSegment = false;
        gap = 0;

        if (lineIndex < maxLines) {
            startNewPage(state);
        }
    }
}

function addTimeSection(
    state,
    measurements,
    timeData,
    gap,
) {
    if (!timeData) return false;

    const maxLines = Math.max(
        timeData.estimatedLines.length,
        timeData.paymentLines.length,
        1,
    );
    const completeHeight =
        measurements.timeTitleHeight +
        maxLines * measurements.timeLineHeight;
    const maximumHeight =
        completeHeight +
        PDF_LAYOUT.timeExtraMm *
            state.pixelsPerMillimeter;

    if (maximumHeight <= state.pageHeight) {
        addElement(
            state,
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
        return true;
    }

    addPaginatedTimeSection(
        state,
        measurements,
        timeData,
        maxLines,
        gap,
    );
    return true;
}

export function buildPreviewPages({
    pageHeight,
    pixelsPerMillimeter,
    measurements,
    jobBlocks,
    observationBlocks,
    items,
    timeData,
}) {
    if (!pageHeight || !pixelsPerMillimeter) {
        return [createEmptyPage(1)];
    }

    const state = createPaginationState(
        pageHeight,
        pixelsPerMillimeter,
    );
    const sectionGap =
        PDF_LAYOUT.sectionGapMm * pixelsPerMillimeter;

    addElement(
        state,
        { type: "client" },
        measurements.clientHeight,
    );
    addRichSection(state, measurements, jobBlocks, {
        title: "Descripción del trabajo:",
        startReserveMm: PDF_LAYOUT.jobStartReserveMm,
        gap: sectionGap,
    });
    addTableSection(
        state,
        measurements.table,
        items,
        sectionGap,
    );

    const tableAfterGap =
        PDF_LAYOUT.tableAfterGapMm *
        pixelsPerMillimeter;
    const addedTimeSection = addTimeSection(
        state,
        measurements,
        timeData,
        sectionGap + tableAfterGap,
    );

    addRichSection(
        state,
        measurements,
        observationBlocks,
        {
            title: "Aclaraciones finales:",
            startReserveMm:
                PDF_LAYOUT.observationsStartReserveMm,
            gap:
                sectionGap +
                (addedTimeSection ? 0 : tableAfterGap),
        },
    );

    return state.pages.filter(
        (page) => page.elements.length > 0,
    );
}
