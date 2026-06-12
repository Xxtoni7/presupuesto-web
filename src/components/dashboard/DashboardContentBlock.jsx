import PropTypes from "prop-types";
import RecentPresupuestosContent from "./RecentPresupuestosContent";
import ToggleSideContent from "./ToggleSideContent";

function DashboardContentBlock({ recentPresupuestos, plan, usage, metrics, onboarding, onNavigate,}) {
    return (
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid items-start xl:grid-cols-[1.3fr_0.7fr]">
                <RecentPresupuestosContent
                    presupuestos={recentPresupuestos || []}
                    onboarding={onboarding}
                    onNavigate={onNavigate}
                />

                <ToggleSideContent
                    plan={plan}
                    usage={usage}
                    metrics={metrics}
                    onNavigate={onNavigate}
                />
            </div>
        </section>
    );
}

DashboardContentBlock.propTypes = {
    recentPresupuestos: PropTypes.array.isRequired,
    plan: PropTypes.object.isRequired,
    usage: PropTypes.object.isRequired,
    metrics: PropTypes.object.isRequired,
    onboarding: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
};

export default DashboardContentBlock;