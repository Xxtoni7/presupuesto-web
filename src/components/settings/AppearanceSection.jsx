import { Monitor, MonitorCog, Moon, Sun } from "lucide-react";
import SettingsSectionHeader from "./SettingsSectionHeader";
import { useTheme } from "../../context/useTheme";

const THEME_OPTIONS = [
    { value: "light", label: "Claro", description: "Un espacio luminoso", icon: Sun, previewClassName: "settings-theme-preview--light" },
    { value: "dark", label: "Oscuro", description: "Menos luz, mismo enfoque", icon: Moon, previewClassName: "settings-theme-preview--dark" },
    { value: "system", label: "Sistema", description: "Se adapta a tu dispositivo", icon: Monitor, previewClassName: "settings-theme-preview--system" },
];

function AppearanceSection() {
    const { theme, setTheme } = useTheme();

    return (
        <section id="apariencia" className="settings-section">
            <SettingsSectionHeader icon={MonitorCog} title="Apariencia" description="Elegí cómo querés ver tu espacio de trabajo." />
            <fieldset>
                <legend className="sr-only">Tema de la aplicación</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                    {THEME_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                            <label key={option.value} aria-label={option.label} className="relative cursor-pointer">
                                <input type="radio" name="app-theme" value={option.value} checked={theme === option.value} onChange={() => setTheme(option.value)} className="peer sr-only" />
                                <span className="block h-full rounded-xl border border-border p-3 transition-colors hover:border-muted-foreground/50 peer-checked:border-primary/60 peer-checked:bg-primary/5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                                    <span aria-hidden="true" className={`settings-theme-preview ${option.previewClassName}`}>
                                        <span className="settings-preview-sidebar"><i /><i /><i /></span>
                                        <span className="settings-preview-document">
                                            <span className="settings-preview-title">Presupuesto</span>
                                            <span className="settings-preview-line" />
                                            <span className="settings-preview-line" />
                                            <span className="settings-preview-total" />
                                        </span>
                                    </span>
                                    <span className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Icon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                                        {option.label}
                                        <span aria-hidden="true" className={`ml-auto flex h-4 w-4 items-center justify-center rounded-full border ${theme === option.value ? "border-primary bg-primary" : "border-input"}`}>
                                            {theme === option.value && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                                        </span>
                                    </span>
                                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.description}</span>
                                </span>
                            </label>
                        );
                    })}
                </div>
            </fieldset>
            <p className="mt-4 text-xs text-muted-foreground">Se guarda automáticamente en este dispositivo.</p>
        </section>
    );
}

export default AppearanceSection;
