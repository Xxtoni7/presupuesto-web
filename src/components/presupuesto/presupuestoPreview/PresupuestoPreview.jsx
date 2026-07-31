import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import PresupuestoPreviewPage from "./PresupuestoPreviewPage";
import { MeasurementContent, PreviewPageContent } from "./PresupuestoPreviewSections";
import { usePresupuestoPreviewPagination } from "./usePresupuestoPreviewPagination";
import { applyOrderedListStartValues, getRichTextBlocks, hasRichTextContent, isLightColor, normalizeRichTextHtml } from "./presupuestoPreviewUtils";

const RICH_TEXT_SANITIZE_OPTIONS = {
    ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "u",
        "ul",
        "ol",
        "li",
    ],
    ALLOWED_ATTR: ["start"],
};

function getSafeRichTextBlocks(html, prefix) {
    const normalizedHtml = normalizeRichTextHtml(html);
    const numberedHtml =
        applyOrderedListStartValues(normalizedHtml);
    const safeHtml = DOMPurify.sanitize(
        numberedHtml,
        RICH_TEXT_SANITIZE_OPTIONS,
    );

    return hasRichTextContent(safeHtml)
        ? getRichTextBlocks(safeHtml, prefix)
        : [];
}

function PresupuestoPreview({ presupuesto, company, items }) {
    const primaryColor = company?.colorMain || "#ef4444";
    const secondaryColor =
        company?.colorSecondary || "#000000";
    const logoSrc = company?.logoUrl?.trim() || null;
    const [loadedLogo, setLoadedLogo] = useState(null);
    const logoImageSize =
        loadedLogo?.src === logoSrc && !loadedLogo.error
            ? {
                    width: loadedLogo.width,
                    height: loadedLogo.height,
                }
            : null;
    const jobBlocks = useMemo(
        () =>
            getSafeRichTextBlocks(
                presupuesto.jobDescription,
                "job",
            ),
        [presupuesto.jobDescription],
    );
    const observationBlocks = useMemo(
        () =>
            getSafeRichTextBlocks(
                presupuesto.observations,
                "observations",
            ),
        [presupuesto.observations],
    );
    const headerTextColor = isLightColor(secondaryColor)
        ? "#111827"
        : "#ffffff";
    const { pages, headerRef, mainRef, pageRef, measurementRef } = usePresupuestoPreviewPagination({
        company,
        presupuesto,
        items,
        jobBlocks,
        observationBlocks,
    });

    return (
        <div className="w-full overflow-x-auto bg-slate-100 px-4 py-8">
            {logoSrc && loadedLogo?.src !== logoSrc && (
                <img
                    key={logoSrc}
                    src={logoSrc}
                    alt=""
                    aria-hidden="true"
                    crossOrigin="anonymous"
                    className="pointer-events-none fixed -z-50 h-px w-px"
                    style={{
                        left: "-10000px",
                        visibility: "hidden",
                    }}
                    onLoad={(event) => {
                        setLoadedLogo({
                            src: logoSrc,
                            width: event.currentTarget.naturalWidth,
                            height:
                                event.currentTarget.naturalHeight,
                            error: false,
                        });
                    }}
                    onError={() => {
                        setLoadedLogo({
                            src: logoSrc,
                            width: 0,
                            height: 0,
                            error: true,
                        });
                    }}
                />
            )}

            <MeasurementContent
                measurementRef={measurementRef}
                presupuesto={presupuesto}
                items={items}
                jobBlocks={jobBlocks}
                observationBlocks={observationBlocks}
                secondaryColor={secondaryColor}
                headerTextColor={headerTextColor}
                primaryColor={primaryColor}
            />

            <div className="space-y-8">
                {pages.map((page, pageIndex) => (
                    <PresupuestoPreviewPage
                        key={page.id}
                        pageIndex={pageIndex}
                        totalPages={pages.length}
                        company={company}
                        presupuesto={presupuesto}
                        primaryColor={primaryColor}
                        logoSrc={logoSrc}
                        logoImageSize={logoImageSize}
                        pageRef={pageRef}
                        headerRef={headerRef}
                        mainRef={mainRef}
                    >
                        <PreviewPageContent
                            elements={page.elements}
                            presupuesto={presupuesto}
                            items={items}
                            secondaryColor={secondaryColor}
                            headerTextColor={headerTextColor}
                            primaryColor={primaryColor}
                        />
                    </PresupuestoPreviewPage>
                ))}
            </div>
        </div>
    );
}

PresupuestoPreview.propTypes = {
    presupuesto: PropTypes.shape({
        budgetNumber: PropTypes.string,
        clientName: PropTypes.string,
        fechaPresupuesto: PropTypes.string,
        fechaVencimiento: PropTypes.string,
        workAddress: PropTypes.string,
        jobDescription: PropTypes.string,
        estimatedTime: PropTypes.string,
        paymentTerms: PropTypes.string,
        observations: PropTypes.string,
        total: PropTypes.number,
    }).isRequired,

    company: PropTypes.shape({
        name: PropTypes.string,
        logoUrl: PropTypes.string,
        colorMain: PropTypes.string,
        colorSecondary: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
    }),

    items: PropTypes.arrayOf(
        PropTypes.shape({
            idItem: PropTypes.number,
            description: PropTypes.string,
            materials: PropTypes.number,
            labor: PropTypes.number,
            quantity: PropTypes.number,
            subtotal: PropTypes.number,
        }),
    ).isRequired,
};

export default PresupuestoPreview;