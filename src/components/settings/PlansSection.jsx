import PropTypes from "prop-types";
import { Sparkles } from "lucide-react";
import PlanOptionCard from "./PlanOptionCard";
import SettingsSectionHeader from "./SettingsSectionHeader";

function PlansSection({ availablePlans, currentPlanName }) {
    return (
        <section id="planes" className="settings-section">
            <SettingsSectionHeader
                icon={Sparkles}
                title="Planes disponibles"
                description="Compará los recursos de cada plan. Los cambios estarán disponibles próximamente."
            />

            {availablePlans.length === 0 && <p className="rounded-lg bg-background p-4 text-sm text-muted-foreground">No hay planes disponibles para mostrar en este momento.</p>}
            <div className="grid gap-3 min-[1100px]:grid-cols-3">
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
