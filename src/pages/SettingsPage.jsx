import { useEffect, useState } from "react";
import { getAvailablePlans, getCurrentPlan } from "../api/planApi";
import { useAuth } from "../context/AuthContext";
import AppearanceSection from "../components/settings/AppearanceSection";
import PlansSection from "../components/settings/PlansSection";
import ProfileSection from "../components/settings/ProfileSection";
import SettingsDesktopAside from "../components/settings/SettingsDesktopAside";
import SettingsMobileHeader from "../components/settings/SettingsMobileHeader";
import SubscriptionSection from "../components/settings/SubscriptionSection";
import { SETTINGS_SECTIONS } from "../components/settings/settingsSections";

function SettingsPage() {
    const { user } = useAuth();

    const [currentPlan, setCurrentPlan] = useState(null);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("perfil");

    useEffect(() => {
        const loadSettingsData = async () => {
            try {
                setLoading(true);
                setError("");

                const [currentPlanData, availablePlansData] = await Promise.all([
                    getCurrentPlan(),
                    getAvailablePlans(),
                ]);

                setCurrentPlan(currentPlanData);
                setAvailablePlans(availablePlansData);
            } catch (err) {
                setError(err.message || "No se pudo cargar la configuracion.");
            } finally {
                setLoading(false);
            }
        };

        loadSettingsData();
    }, []);

    useEffect(() => {
        const sectionIds = SETTINGS_SECTIONS.map((section) => section.id);
        const sectionId = globalThis.location.hash.replace("#", "");

        if (sectionIds.includes(sectionId)) {
            setActiveSection(sectionId);
        }
    }, []);

    useEffect(() => {
        if (loading) return undefined;

        const sectionIds = SETTINGS_SECTIONS.map((section) => section.id);
        const updateActiveSection = () => {
            const isNearPageEnd =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 24;

            if (isNearPageEnd) {
                setActiveSection("apariencia");
                return;
            }

            const activeId = sectionIds.reduce((currentActiveId, sectionId) => {
                const sectionElement = document.getElementById(sectionId);

                if (!sectionElement) return currentActiveId;

                const sectionTop = sectionElement.getBoundingClientRect().top;

                if (sectionTop <= 140) {
                    return sectionId;
                }

                return currentActiveId;
            }, "perfil");

            setActiveSection(activeId);
        };

        updateActiveSection();
        window.addEventListener("scroll", updateActiveSection, { passive: true });
        window.addEventListener("resize", updateActiveSection);

        return () => {
            window.removeEventListener("scroll", updateActiveSection);
            window.removeEventListener("resize", updateActiveSection);
        };
    }, [loading]);

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500">
                    Cargando configuracion...
                </p>
            </div>
        );
    }

    const currentPlanName = currentPlan?.planName || user?.planName || "Free";

    return (
        <div className="lg:-m-8 lg:flex lg:min-h-screen">
            <SettingsMobileHeader />

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <SettingsDesktopAside
                sections={SETTINGS_SECTIONS}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            <div className="w-full min-w-0 flex-1 lg:p-6 xl:p-8">
                <div className="w-full rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 xl:p-8">
                    <div className="space-y-12">
                        <ProfileSection
                            user={user}
                            currentPlanName={currentPlanName}
                        />

                        <SubscriptionSection
                            currentPlan={currentPlan}
                            currentPlanName={currentPlanName}
                        />

                        <PlansSection
                            availablePlans={availablePlans}
                            currentPlanName={currentPlanName}
                        />

                        <AppearanceSection />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;

