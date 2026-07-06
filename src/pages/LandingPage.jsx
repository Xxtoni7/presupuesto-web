import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";

const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";

function LandingPage() {
    return (
        <div className="landing-page h-[100svh] overflow-hidden bg-[linear-gradient(180deg,#07070a_0%,#14070a_38%,#050507_100%)] text-white">
            <Header
                loginPath={LOGIN_PATH}
                registerPath={REGISTER_PATH}
            />

            <Hero
                loginPath={LOGIN_PATH}
                registerPath={REGISTER_PATH}
            />
        </div>
    );
}

export default LandingPage;
