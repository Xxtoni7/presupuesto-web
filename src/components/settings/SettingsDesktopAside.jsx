import PropTypes from "prop-types";

function SettingsDesktopAside({ sections, activeSection, onSectionChange }) {
    return (
        <aside className="settings-mobile-navigation min-w-0 xl:sticky xl:top-24 xl:w-44 xl:shrink-0 xl:self-start">
            <nav aria-label="Secciones de configuración" className="settings-mobile-navigation-list grid grid-cols-2 gap-1 sm:flex xl:flex-col">
                {sections.map((section) => {
                    const Icon = section.icon;

                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => onSectionChange(section.id)}
                            aria-current={activeSection === section.id ? "location" : undefined}
                            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                                activeSection === section.id
                                    ? "bg-primary/10 font-semibold text-foreground"
                                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <Icon aria-hidden="true" className={`h-4 w-4 ${activeSection === section.id ? "text-primary" : ""}`} />
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
