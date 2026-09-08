import PropTypes from "prop-types";
import { Mail, User } from "lucide-react";
import SettingsSectionHeader from "./SettingsSectionHeader";

function ProfileSection({ user, currentPlanName }) {
    return (
        <section id="perfil" className="settings-section">
            <SettingsSectionHeader
                icon={User}
                title="Perfil"
                description="Información de tu cuenta"
            />

            <div className="grid gap-6 rounded-lg bg-background p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Email
                    </p>
                    <p className="mt-2 flex items-center gap-2 break-all text-sm font-medium text-foreground">
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {user?.email || "Sin email disponible"}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Plan actual
                    </p>
                    <p className="mt-2 inline-flex rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
                        Plan {currentPlanName}
                    </p>
                </div>
            </div>
        </section>
    );
}

ProfileSection.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string,
        planName: PropTypes.string,
    }),
    currentPlanName: PropTypes.string.isRequired,
};

export default ProfileSection;
