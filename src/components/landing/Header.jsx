import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import logo from "../../assets/logo.webp";

function Header({ loginPath, registerPath }) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 56);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "border-b border-red-400/15 bg-[rgba(28,5,8,0.66)] text-white shadow-sm shadow-black/20 backdrop-blur-[32px] supports-[backdrop-filter]:bg-[rgba(28,5,8,0.58)]"
                    : "border-b border-transparent bg-transparent text-white shadow-none"
            }`}
        >
            <div className="flex h-16 w-full items-center justify-between gap-2 px-4 sm:h-20 sm:px-8 lg:px-12 xl:px-16">
                <Link
                    to="/"
                    className="flex min-w-0 items-center gap-2 sm:gap-3"
                    aria-label="MT Presupuestos"
                >
                    <img
                        src={logo}
                        alt="Logo de MT Presupuestos"
                        className="h-10 w-10 shrink-0 object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.35)] sm:h-12 sm:w-12"
                    />

                    <span className="hidden truncate text-sm font-bold tracking-tight sm:block sm:text-lg">
                        MT Presupuestos
                    </span>
                </Link>

                <nav
                    className="flex shrink-0 items-center gap-1.5 sm:gap-3"
                    aria-label="Acceso"
                >
                    <Button
                        asChild
                        variant="outline"
                        className={`h-8 px-2 text-[11px] shadow-none sm:h-9 sm:px-4 sm:text-sm ${
                            isScrolled
                                ? "border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                                : "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        <Link to={loginPath}>Iniciar sesión</Link>
                    </Button>

                    <Button
                        asChild
                        className="h-8 bg-red-600 px-2 text-[11px] font-semibold text-white shadow-sm shadow-red-600/30 hover:bg-red-700 sm:h-9 sm:px-4 sm:text-sm"
                    >
                        <Link to={registerPath}>Empezar gratis</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}

Header.propTypes = {
    loginPath: PropTypes.string.isRequired,
    registerPath: PropTypes.string.isRequired,
};

export default Header;
