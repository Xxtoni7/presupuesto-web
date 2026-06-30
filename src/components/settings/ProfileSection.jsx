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

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">
                            Email
                        </p>
                        <p className="mt-2 flex items-center gap-2 break-all text-base font-semibold text-[#111111]">
                            <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                            {user?.email || "Sin email disponible"}
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">
                            Plan actual
                        </p>
                        <p className="mt-2 text-base font-semibold text-red-500">
                            Plan {currentPlanName}
                        </p>
                    </div>
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
