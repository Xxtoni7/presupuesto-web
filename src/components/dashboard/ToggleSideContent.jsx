import { useState } from "react";
import PropTypes from "prop-types";
import HighlightContent from "./HighlightContent";
import PlanUsageContent from "./PlanUsageContent";

function ToggleSideContent({ plan, usage, metrics, onNavigate }) {
    const hasHighlightedBudget =
        metrics.highestBudgetTotal !== null &&
        metrics.highestBudgetTotal !== undefined;

    const [activeView, setActiveView] = useState(
        hasHighlightedBudget ? "highlight" : "usage"
    );

    return (
        <aside className="border-t border-border p-5 xl:border-l xl:border-t-0">
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-muted p-1">
                <button
                    type="button"
                    onClick={() => setActiveView("highlight")}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                        activeView === "highlight"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Destacado
                </button>

                <button
                    type="button"
                    onClick={() => setActiveView("usage")}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                        activeView === "usage"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Plan
                </button>
            </div>

            {activeView === "highlight" ? (
                <HighlightContent metrics={metrics} />
            ) : (
                <PlanUsageContent
                    plan={plan}
                    usage={usage}
                    onNavigate={onNavigate}
                />
            )}
        </aside>
    );
}

ToggleSideContent.propTypes = {
    plan: PropTypes.object.isRequired,
    usage: PropTypes.object.isRequired,
    metrics: PropTypes.object.isRequired,
    onNavigate: PropTypes.func.isRequired,
};

export default ToggleSideContent;