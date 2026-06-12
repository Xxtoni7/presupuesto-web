import PropTypes from "prop-types";
import { ArrowRight, Sparkles } from "lucide-react";

function EmptyRecentPresupuestosCta({ onboarding, onNavigate }) {
    const title = onboarding?.title || "Creá tu primer presupuesto";
    const description =
        onboarding?.description ||
        "Empezá cargando tu empresa y creando tu primer presupuesto profesional.";
    const actionLabel = onboarding?.actionLabel || "Crear empresa";
    const actionUrl = onboarding?.actionUrl || "/companies";

    return (
        <section className="rounded-2xl bg-[#111111] p-6 text-white">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-red-300" />
                Siguiente paso
            </div>

            <h3 className="text-2xl font-bold">{title}</h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                {description}
            </p>

            <button
                type="button"
                onClick={() => onNavigate(actionUrl)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#111111] transition hover:bg-gray-100"
            >
                {actionLabel}
                <ArrowRight className="h-4 w-4" />
            </button>
        </section>
    );
}

EmptyRecentPresupuestosCta.propTypes = {
    onboarding: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        actionLabel: PropTypes.string,
        actionUrl: PropTypes.string,
    }),
    onNavigate: PropTypes.func.isRequired,
};

export default EmptyRecentPresupuestosCta;