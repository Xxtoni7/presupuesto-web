import { MonitorCog } from "lucide-react";
import SettingsSectionHeader from "./SettingsSectionHeader";

function AppearanceSection() {
    return (
        <section id="apariencia" className="scroll-mt-24 border-t border-gray-100 pt-10">
            <SettingsSectionHeader
                icon={MonitorCog}
                title="Apariencia"
                description="Personalizá la apariencia de la aplicación"
                iconClassName="text-purple-600"
                iconContainerClassName="bg-purple-50"
            />

            <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-gray-600">
                    Modo oscuro
                </p>

                <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 sm:justify-end"
                >
                    Proximamente
                </button>
            </div>
        </section>
    );
}

export default AppearanceSection;

