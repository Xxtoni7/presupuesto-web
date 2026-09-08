import PropTypes from "prop-types";
import { ArrowUpRight, Building2, Crown, Download, FileText } from "lucide-react";
import { getUsageLabel } from "../../utils/settingsPlanFormatters";
import SettingsSectionHeader from "./SettingsSectionHeader";

const RESOURCES = [
    { label: "Empresas", icon: Building2, used: "companiesUsed", max: "maxCompanies" },
    { label: "Presupuestos", icon: FileText, used: "presupuestosUsed", max: "maxPresupuestos" },
    { label: "Exportaciones PDF", icon: Download, used: "pdfExportsUsed", max: "maxPdfExports" },
];

function SubscriptionSection({ currentPlan, currentPlanName }) {
    return (
        <section id="suscripcion" className="settings-section">
            <SettingsSectionHeader icon={Crown} title="Suscripción y uso" description="Los recursos de tu espacio de trabajo, en un vistazo." />
            <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <div className="flex flex-col items-start rounded-xl border border-primary/10 bg-primary/5 p-5 dark:border-primary/20 dark:bg-primary/10">
                    <span className="text-xs font-medium text-muted-foreground">Tu plan actual</span>
                    <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{currentPlanName}</h3>
                    <p className="mb-6 mt-3 text-sm leading-relaxed text-muted-foreground">Tus recursos para organizar empresas y preparar presupuestos.</p>
                    <a href="#planes" className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
                        Comparar planes <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-primary" />
                    </a>
                </div>
                {currentPlan ? (
                    <div className="divide-y divide-border/60">
                        {RESOURCES.map(({ label, icon, used, max }) => {
                            const Icon = icon;
                            const unlimited = currentPlan[max] === -1;
                            const percentage = currentPlan[max] > 0 ? Math.min(100, Math.max(0, currentPlan[used] / currentPlan[max] * 100)) : 0;
                            return (
                                <div key={used} className="py-4 first:pt-1 last:pb-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                        <span className="flex items-center gap-2 text-muted-foreground"><Icon aria-hidden="true" className="h-4 w-4 shrink-0" />{label}</span>
                                        <span className="font-medium tabular-nums text-foreground">{getUsageLabel(currentPlan[used], currentPlan[max])}</span>
                                    </div>
                                    {unlimited ? (
                                        <p className="mt-2 text-xs text-muted-foreground">{currentPlan[used]} utilizados · Sin límite en tu plan</p>
                                    ) : (
                                        <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={Math.max(1, currentPlan[max])} aria-valuenow={Math.min(Math.max(0, currentPlan[used]), Math.max(0, currentPlan[max]))} aria-valuetext={getUsageLabel(currentPlan[used], currentPlan[max])} className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div className="h-full rounded-full bg-primary/75" style={{ width: `${percentage}%` }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : <p className="self-center text-sm text-muted-foreground">No se pudo obtener el uso de tu plan.</p>}
            </div>
        </section>
    );
}

SubscriptionSection.propTypes = {
    currentPlan: PropTypes.shape({
        companiesUsed: PropTypes.number.isRequired,
        maxCompanies: PropTypes.number.isRequired,
        presupuestosUsed: PropTypes.number.isRequired,
        maxPresupuestos: PropTypes.number.isRequired,
        pdfExportsUsed: PropTypes.number.isRequired,
        maxPdfExports: PropTypes.number.isRequired,
    }),
    currentPlanName: PropTypes.string.isRequired,
};

export default SubscriptionSection;
