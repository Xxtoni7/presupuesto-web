import { MonitorCog } from "lucide-react";
import SettingsSectionHeader from "./SettingsSectionHeader";

function AppearanceSection() {
    return (
        <section id="apariencia" className="scroll-mt-24">
            <SettingsSectionHeader
                icon={MonitorCog}
                title="Apariencia"
                description="Personalizá la apariencia de la aplicación"
                iconClassName="text-purple-600"
                iconContainerClassName="bg-purple-50"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-medium text-gray-600">
                            Modo oscuro
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 sm:justify-end"
                    >
                        Proximamente
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AppearanceSection;
