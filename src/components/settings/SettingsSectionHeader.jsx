import PropTypes from "prop-types";

function SettingsSectionHeader({
    icon: Icon,
    title,
    description,
    iconClassName = "",
    iconContainerClassName = "",
}) {
    return (
        <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconContainerClassName}`}>
                <Icon className={`h-5 w-5 ${iconClassName}`} />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">
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
    iconClassName: PropTypes.string,
    iconContainerClassName: PropTypes.string,
};

export default SettingsSectionHeader;
