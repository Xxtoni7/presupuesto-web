import { Loader2 } from "lucide-react";

function DashboardLoading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/15">
                    <Loader2 className="h-7 w-7 animate-spin text-red-500" />
                </div>

                <p className="font-semibold text-foreground">
                    Cargando tu Dashboard...
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                    Estamos preparando tus métricas.
                </p>
            </div>
        </div>
    );
}

export default DashboardLoading;