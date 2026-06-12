import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { getDashboardSummary } from "../api/dashboardApi";
import { useAuth } from "../context/AuthContext";
import DashboardLoading from "../components/dashboard/DashboardLoading";
import DashboardTopPanel from "../components/dashboard/DashboardTopPanel";
import DashboardContentBlock from "../components/dashboard/DashboardContentBlock";

function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboardSummary();

                setSummary(data);
            } catch (err) {
                setError(
                    err.message ||
                        "No pudimos cargar la información del Dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleNavigate = (url) => {
        if (!url) return;

        navigate(url);
    };

    if (loading) {
        return <DashboardLoading />;
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                <h2 className="text-lg font-bold">
                    No pudimos cargar el Dashboard
                </h2>

                <p className="mt-1 text-sm">{error}</p>

                <Button
                    type="button"
                    className="mt-4 bg-red-500 hover:bg-red-600"
                    onClick={() => globalThis.location.reload()}
                >
                    Reintentar
                </Button>
            </div>
        );
    }

    if (!summary) return null;

    const { plan, usage, metrics, onboarding, recentPresupuestos } = summary;

    return (
        <div className="space-y-5 pb-5">
            <DashboardTopPanel
                user={user}
                summary={summary}
                onNavigate={handleNavigate}
            />

            <DashboardContentBlock
                recentPresupuestos={recentPresupuestos || []}
                plan={plan}
                usage={usage}
                metrics={metrics}
                onboarding={onboarding}
                onNavigate={handleNavigate}
            />
        </div>
    );
}

export default DashboardPage;