import { Building2, Download, FileText } from "lucide-react";
import { formatNumber, getPdfDescription, isUnlimited } from "./pricingPlanFormatters";

export function buildPlanFeatures(plan) {
    const companiesUnlimited = isUnlimited(plan.maxCompanies);
    const budgetsUnlimited = isUnlimited(plan.maxPresupuestos);
    const pdfUnlimited = isUnlimited(plan.maxPdfExports);
    const companyLabel =
        Number(plan.maxCompanies) === 1 ? "empresa" : "empresas";

    return [
        {
            key: "companies",
            icon: Building2,
            label: companiesUnlimited
                ? "Empresas ilimitadas"
                : `Hasta ${formatNumber(plan.maxCompanies)} ${companyLabel}`,
            description: companiesUnlimited
                ? "Podés crear y administrar todas las empresas que necesites dentro de tu espacio de trabajo."
                : `Podés crear y administrar hasta ${formatNumber(
                    plan.maxCompanies,
                    )} ${companyLabel} dentro de tu espacio de trabajo.`,
        },
        {
            key: "budgets",
            icon: FileText,
            label: budgetsUnlimited
                ? "Presupuestos ilimitados"
                : `${formatNumber(plan.maxPresupuestos)} presupuestos`,
            description: budgetsUnlimited
                ? "Podés mantener todos los presupuestos activos que necesites, sin límite de cantidad."
                : `Podés mantener hasta ${formatNumber(
                        plan.maxPresupuestos,
                    )} presupuestos activos al mismo tiempo.`,
        },
        {
            key: "pdf",
            icon: Download,
            label: pdfUnlimited
                ? "Exportaciones PDF ilimitadas"
                : `${formatNumber(plan.maxPdfExports)} exportaciones PDF`,
            description: getPdfDescription(plan),
        },
    ];
}