import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import PresupuestoForm from "../components/presupuesto/PresupuestoForm";
import { getPresupuestoById } from "../api/presupuestoApi";

function PresupuestoFormPage() {
    const { companyId, presupuestoId } = useParams();
    const navigate = useNavigate();

    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(Boolean(presupuestoId));
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPresupuesto = async () => {
            if (!presupuestoId) return;

            try {
                setLoading(true);
                setError("");

                const data = await getPresupuestoById(presupuestoId);
                setPresupuesto(data);
            } catch {
                setError("No se pudo cargar el presupuesto.");
            } finally {
                setLoading(false);
            }
        };

        loadPresupuesto();
    }, [presupuestoId]);

    const handleSuccess = () => {
        navigate(`/companies/${companyId}/budgets`);
    };

    const handleCancel = () => {
        navigate(`/companies/${companyId}/budgets`);
    };

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                <p className="text-[#6b7280]">Cargando presupuesto...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center gap-3">
                <Link to={`/companies/${companyId}/budgets`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-[#111111]">
                        {presupuestoId ? "Editar presupuesto" : "Nuevo presupuesto"}
                    </h1>
                    <p className="mt-1 text-sm text-[#6b7280]">
                        Complete los datos generales y los ítems del presupuesto
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Datos del presupuesto</CardTitle>
                </CardHeader>

                <CardContent>
                    <PresupuestoForm
                        presupuesto={presupuesto}
                        companyId={companyId}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default PresupuestoFormPage;