import PropTypes from "prop-types";

function SettingsSectionHeader({
    icon,
    title,
    description,
}) {
    const Icon = icon;
    return (
        <div className="mb-6 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground">
                <Icon aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                    {title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

SettingsSectionHeader.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.node.isRequired,
    description: PropTypes.node.isRequired,
};

export default SettingsSectionHeader;
