import PropTypes from "prop-types";
import { Sparkles } from "lucide-react";
import PlanOptionCard from "./PlanOptionCard";
import SettingsSectionHeader from "./SettingsSectionHeader";

function PlansSection({ availablePlans, currentPlanName }) {
    return (
        <section id="planes" className="scroll-mt-24 border-t border-gray-100 pt-10">
            <SettingsSectionHeader
                icon={Sparkles}
                title="Planes disponibles"
                description="Compará todas las opciones y elegí el que mejor se adapte a ti"
                iconClassName="text-amber-600"
                iconContainerClassName="bg-amber-50"
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {availablePlans.map((plan) => (
                    <PlanOptionCard
                        key={plan.idPlan}
                        plan={plan}
                        isCurrent={plan.name === currentPlanName}
                        currentPlanName={currentPlanName}
                    />
                ))}
            </div>
        </section>
    );
}

PlansSection.propTypes = {
    availablePlans: PropTypes.arrayOf(
        PropTypes.shape({
            idPlan: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    currentPlanName: PropTypes.string.isRequired,
};

export default PlansSection;

