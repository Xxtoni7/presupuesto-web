import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Roadmap from "../components/landing/Roadmap";
import PricingPlans from "../components/landing/PricingPlans";

const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";

function LandingPage() {
    return (
        <div className="landing-page min-h-screen overflow-x-hidden bg-[#050507] text-white">
            <Header
                loginPath={LOGIN_PATH}
                registerPath={REGISTER_PATH}
            />

            <Hero
                loginPath={LOGIN_PATH}
                registerPath={REGISTER_PATH}
            />

            <Roadmap />

            <PricingPlans registerPath={REGISTER_PATH} />
        </div>
    );
}

export default LandingPage;