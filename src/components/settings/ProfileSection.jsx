import PropTypes from "prop-types";
import { Mail, User } from "lucide-react";
import SettingsSectionHeader from "./SettingsSectionHeader";

function ProfileSection({ user, currentPlanName }) {
    return (
        <section id="perfil" className="scroll-mt-24">
            <SettingsSectionHeader
                icon={User}
                title="Perfil"
                description="Información de tu cuenta"
                iconClassName="text-blue-600"
                iconContainerClassName="bg-blue-50"
            />

            <div className="grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2">
                <div>
                    <p className="text-sm font-medium text-gray-600">
                        Email
                    </p>
                    <p className="mt-2 flex items-center gap-2 break-all text-base font-semibold text-[#111111]">
                        <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                        {user?.email || "Sin email disponible"}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">
                        Plan actual
                    </p>
                    <p className="mt-2 text-base font-semibold text-red-500">
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
