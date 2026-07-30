import PropTypes from "prop-types";

function MetricStripItem({ title, value, description, icon: Icon, isMoney = false }) {
    return (
        <div className="min-w-0 px-5 py-4">
            <div className="mb-3 flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isMoney
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-300"
                    }`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <p className="truncate text-sm font-semibold text-muted-foreground">
                    {title}
                </p>
            </div>

            <p
                className={`truncate text-2xl font-bold tracking-tight ${
                    isMoney ? "text-emerald-600 dark:text-emerald-300" : "text-foreground"
                }`}
            >
                {value}
            </p>

            <p className="mt-1 truncate text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

MetricStripItem.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    isMoney: PropTypes.bool,
};

export default MetricStripItem;