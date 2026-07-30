import { Monitor, MonitorCog, Moon, Sun } from "lucide-react";
import SettingsSectionHeader from "./SettingsSectionHeader";
import { useTheme } from "../../context/useTheme";

const THEME_OPTIONS = [
    {
        value: "light",
        label: "Claro",
        description: "Apariencia clara",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Oscuro",
        description: "Apariencia oscura",
        icon: Moon,
    },
    {
        value: "system",
        label: "Sistema",
        description: "Usar la preferencia del dispositivo",
        icon: Monitor,
    },
];

function AppearanceSection() {
    const { theme, setTheme } = useTheme();

    return (
        <section
            id="apariencia"
            className="scroll-mt-24 border-t border-border pt-10"
        >
            <SettingsSectionHeader
                icon={MonitorCog}
                title="Apariencia"
                description="Personalizá la apariencia de la aplicación"
                iconClassName="text-purple-600 dark:text-purple-300"
                iconContainerClassName="bg-purple-50 dark:bg-purple-500/15"
            />

            <div className="rounded-2xl border border-border bg-muted/45 p-4 sm:p-5">
                <div className="mb-4">
                    <p className="font-semibold text-foreground">
                        Tema de la aplicación
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Elegí cómo querés ver tu espacio de trabajo.
                    </p>
                </div>

                <div
                    className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                    role="radiogroup"
                    aria-label="Tema de la aplicación"
                >
                    {THEME_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = theme === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => setTheme(option.value)}
                                className={`flex min-h-20 items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${
                                    isSelected
                                        ? "border-red-500 bg-red-500/10 text-foreground shadow-sm"
                                        : "border-border bg-card text-foreground hover:border-red-400/60 hover:bg-accent"
                                }`}
                            >
                                <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                        isSelected
                                            ? "bg-red-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                </span>

                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold">
                                        {option.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                        {option.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default AppearanceSection;
