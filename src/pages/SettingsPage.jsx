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
import SectionLoading from "../components/ui/SectionLoading";

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
        return <SectionLoading message="Cargando configuración..." />;
    }

    const currentPlanName = currentPlan?.planName || user?.planName || "Free";

    return (
        <div className="mx-auto w-full max-w-6xl">
            <SettingsMobileHeader />

            {error && (
                <div role="alert" className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-6 xl:flex-row xl:gap-10">
                <SettingsDesktopAside
                    sections={SETTINGS_SECTIONS}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />

                <div className="w-full min-w-0 flex-1">
                    <div className="space-y-6">
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

