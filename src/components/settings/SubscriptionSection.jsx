import PropTypes from "prop-types";
import { Building2, Crown, Download, FileText } from "lucide-react";
import { getUsageLabel } from "../../utils/settingsPlanFormatters";
import SettingsSectionHeader from "./SettingsSectionHeader";

function SubscriptionSection({ currentPlan, currentPlanName }) {
    return (
        <section id="suscripcion" className="scroll-mt-24 border-t border-border pt-10">
            <SettingsSectionHeader
                icon={Crown}
                title="Suscripción"
                description="Plan actual y recursos disponibles"
                iconClassName="text-red-500"
                iconContainerClassName="bg-red-50 dark:bg-red-500/15"
            />

            <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm dark:border-red-500/25 dark:from-red-500/15 dark:to-card">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-sm">
                            <Crown className="h-6 w-6 text-red-500" />
                        </div>
                        <span className="rounded-full bg-card px-3 py-1 text-xs font-semibold text-red-500 shadow-sm">
                            Actual
                        </span>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Tu suscripción
                        </p>
                        <h3 className="mt-2 text-4xl font-bold text-foreground">
                            {currentPlanName}
                        </h3>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-muted-foreground">
                        Tu cuenta está usando el plan <span className="font-semibold text-foreground">{currentPlanName}</span>.
                    </p>
                </div>

                {currentPlan && (
                    <div className="rounded-2xl border border-border bg-muted/45 p-6 shadow-sm">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-foreground">
                                Uso disponible
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Recursos de tu plan
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-red-500" />
                                    <span className="text-sm font-medium text-foreground">
                                        Empresas
                                    </span>
                                </div>
                                <span className="font-semibold text-foreground">
                                    {getUsageLabel(
                                        currentPlan.companiesUsed,
                                        currentPlan.maxCompanies
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-red-500" />
                                    <span className="text-sm font-medium text-foreground">
                                        Presupuestos
                                    </span>
                                </div>
                                <span className="font-semibold text-foreground">
                                    {getUsageLabel(
                                        currentPlan.presupuestosUsed,
                                        currentPlan.maxPresupuestos
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Download className="h-5 w-5 text-red-500" />
                                    <span className="text-sm font-medium text-foreground">
                                        Exportaciones PDF
                                    </span>
                                </div>
                                <span className="font-semibold text-foreground">
                                    {getUsageLabel(
                                        currentPlan.pdfExportsUsed,
                                        currentPlan.maxPdfExports
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
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
