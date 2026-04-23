export const emptyPresupuesto = {
    title: "",
    clientName: "",
    fechaPresupuesto: "",
    fechaVencimiento: "",
    workAddress: "",
    jobDescription: "",
    estimatedTime: "",
    paymentTerms: "",
    observations: "",
    idCompany: "",
};

export const presupuestoEditableFields = [
    "title",
    "clientName",
    "fechaPresupuesto",
    "fechaVencimiento",
    "workAddress",
    "jobDescription",
    "estimatedTime",
    "paymentTerms",
    "observations",
];

export const presupuestoReadonlyFields = [
    "budgetNumber",
    "total",
    "idCompany",
];