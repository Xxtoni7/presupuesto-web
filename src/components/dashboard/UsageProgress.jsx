import PropTypes from "prop-types";
import { clampPercentage, formatPercent, isUnlimited } from "../../utils/dashboardFormatters";

function UsageProgress({ title, used, max, percentage, icon: Icon }) {
    const unlimited = isUnlimited(max, percentage);
    const safePercentage = clampPercentage(percentage);

    return (
        <div className="rounded-2xl bg-muted/55 p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-red-500 shadow-sm">
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate font-semibold text-foreground">
                            {title}
                        </h3>

                        {unlimited ? (
                            <p className="text-sm text-muted-foreground">Uso ilimitado</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {formatPercent(safePercentage)} usado
                            </p>
                        )}
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    {unlimited ? (
                        <p className="font-bold text-foreground">Ilimitado</p>
                    ) : (
                        <p className="font-bold text-foreground">
                            {used} / {max}
                        </p>
                    )}
                </div>
            </div>

            {!unlimited && (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                        className="h-full rounded-full bg-red-500 transition-all duration-500"
                        style={{ width: `${safePercentage}%` }}
                    />
                </div>
            )}
        </div>
    );
}

UsageProgress.propTypes = {
    title: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    percentage: PropTypes.number,
    icon: PropTypes.elementType.isRequired,
};

export default UsageProgress;