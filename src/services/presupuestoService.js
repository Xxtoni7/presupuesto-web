import { createPresupuesto } from "../api/presupuestoApi";
import { getItemsByPresupuesto, createPresupuestoItem } from "../api/presupuestoItemApi";

export async function duplicatePresupuesto(presupuesto) {
    const items = await getItemsByPresupuesto(presupuesto.idPresupuesto);

    const newPresupuesto = await createPresupuesto({
        title: `${presupuesto.title} (Copia)`,
        clientName: presupuesto.clientName,
        fechaPresupuesto: presupuesto.fechaPresupuesto,
        fechaVencimiento: presupuesto.fechaVencimiento,
        workAddress: presupuesto.workAddress,
        jobDescription: presupuesto.jobDescription,
        estimatedTime: presupuesto.estimatedTime,
        paymentTerms: presupuesto.paymentTerms,
        observations: presupuesto.observations,
        idCompany: presupuesto.idCompany,
    });

    await Promise.all(
        items.map((item) =>
            createPresupuestoItem({
                description: item.description,
                materials: item.materials,
                labor: item.labor,
                quantity: item.quantity,
                idPresupuesto: newPresupuesto.idPresupuesto,
            })
        )
    );

    return newPresupuesto;
}