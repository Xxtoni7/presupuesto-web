import PropTypes from "prop-types";

function SettingsDesktopAside({ sections, activeSection, onSectionChange }) {
    return (
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[240px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card lg:px-5 lg:py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    Configuración
                </h1>
            </div>

            <nav className="flex flex-col gap-1">
                {sections.map((section) => {
                    const Icon = section.icon;

                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => onSectionChange(section.id)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                activeSection === section.id
                                    ? "bg-red-500 text-white shadow-sm"
                                    : "text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{section.label}</span>
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
}

SettingsDesktopAside.propTypes = {
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.elementType.isRequired,
        })
    ).isRequired,
    activeSection: PropTypes.string.isRequired,
    onSectionChange: PropTypes.func.isRequired,
};

export default SettingsDesktopAside;
