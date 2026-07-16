import { useCallback, useEffect, useState } from "react";

function usePricingTooltip() {
    const [openTooltip, setOpenTooltip] = useState(null);

    const showTooltip = useCallback((tooltipKey) => {
        setOpenTooltip(tooltipKey);
    }, []);

    const closeTooltipIfOpen = useCallback((tooltipKey) => {
        setOpenTooltip((currentTooltip) =>
            currentTooltip === tooltipKey ? null : currentTooltip,
        );
    }, []);

    const toggleTooltip = useCallback((tooltipKey) => {
        setOpenTooltip((currentTooltip) =>
            currentTooltip === tooltipKey ? null : tooltipKey,
        );
    }, []);

    useEffect(() => {
        function handlePointerDown(event) {
            if (
                event.target instanceof Element &&
                event.target.closest("[data-pricing-tooltip-trigger]")
            ) {
                return;
            }

            setOpenTooltip(null);
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setOpenTooltip(null);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return {
        openTooltip,
        showTooltip,
        closeTooltipIfOpen,
        toggleTooltip,
    };
}

export default usePricingTooltip;
