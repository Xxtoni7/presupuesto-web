import PropTypes from "prop-types";
import {
    formatDate,
    getPreviewLogoBoxSize,
    getPreviewTextLines,
    getPreviewTextWidthMm,
    PDF_FOOTER_LAYOUT,
    PDF_HEADER_LAYOUT,
    PDF_LAYOUT,
    pointsToMillimeters,
} from "./presupuestoPreviewUtils";

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
            >
                <title>
                    {`Encabezado del presupuesto ${presupuesto?.budgetNumber || "-"}`}
                </title>

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
                >
                    <title>
                        {`${labelText} ${expirationDateText}`}
                    </title>

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
            >
                <title>
                    {`Presupuesto ${presupuesto?.budgetNumber || "-"}, ${companyNameLine}`}
                </title>

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

export default function PresupuestoPreviewPage({
    pageIndex,
    totalPages,
    company,
    presupuesto,
    primaryColor,
    logoSrc,
    logoImageSize,
    pageRef,
    headerRef,
    mainRef,
    children,
}) {
    const isFirstPage = pageIndex === 0;

    return (
        <section
            ref={isFirstPage ? pageRef : null}
            className="relative mx-auto box-border flex h-[297mm] w-[210mm] shrink-0 flex-col overflow-hidden bg-white text-black shadow-[0_20px_60px_rgba(15,23,42,0.16)] [color-scheme:light]"
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
                headerRef={isFirstPage ? headerRef : null}
            />

            <main
                ref={isFirstPage ? mainRef : null}
                className="min-h-0 flex-1 overflow-hidden"
                style={{
                    marginTop: `${PDF_LAYOUT.mainGapAfterHeaderMm}mm`,
                }}
            >
                {children}
            </main>

            <PreviewFooter
                company={company}
                presupuesto={presupuesto}
                primaryColor={primaryColor}
                isLastPage={pageIndex === totalPages - 1}
            />
        </section>
    );
}

const companyPropType = PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
});

const presupuestoPropType = PropTypes.shape({
    budgetNumber: PropTypes.string,
    fechaPresupuesto: PropTypes.string,
    fechaVencimiento: PropTypes.string,
});

PreviewHeader.propTypes = {
    company: companyPropType,
    presupuesto: presupuestoPropType.isRequired,
    primaryColor: PropTypes.string.isRequired,
    logoSrc: PropTypes.string,
    logoImageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    headerRef: PropTypes.shape({
        current: PropTypes.any,
    }),
};

PreviewFooter.propTypes = {
    company: companyPropType,
    presupuesto: presupuestoPropType.isRequired,
    primaryColor: PropTypes.string.isRequired,
    isLastPage: PropTypes.bool.isRequired,
};

PresupuestoPreviewPage.propTypes = {
    pageIndex: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    company: companyPropType,
    presupuesto: presupuestoPropType.isRequired,
    primaryColor: PropTypes.string.isRequired,
    logoSrc: PropTypes.string,
    logoImageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    pageRef: PropTypes.shape({
        current: PropTypes.any,
    }),
    headerRef: PropTypes.shape({
        current: PropTypes.any,
    }),
    mainRef: PropTypes.shape({
        current: PropTypes.any,
    }),
    children: PropTypes.node,
};