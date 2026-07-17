import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../../assets/logo.webp";

const QUICK_LINKS = [
    { name: "Inicio", href: "#inicio" },
    { name: "Cómo funciona", href: "#como-funciona" },
    { name: "Planes", href: "#planes" },
];

function scrollToSection(event, href) {
    event.preventDefault();
    const element = document.querySelector(href);

    if (!element) {
        return;
    }

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
}

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t border-red-500/20 bg-[#020202] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(220,38,38,0.10),transparent_24rem),radial-gradient(circle_at_88%_85%,rgba(127,29,29,0.10),transparent_25rem)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent shadow-[0_0_18px_rgba(239,68,68,0.55)]" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div>
                        <a
                            href="#inicio"
                            onClick={(event) =>
                                scrollToSection(event, "#inicio")
                            }
                            className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/40"
                            aria-label="Volver al inicio"
                        >
                            <div className="h-12 w-12 overflow-hidden rounded-xl border border-red-500/30 bg-black/20 shadow-lg shadow-red-600/20 backdrop-blur-sm">
                                <img
                                    src={logo}
                                    alt="Logo de MT Presupuestos"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <span className="text-xl font-bold text-white">
                                MT <span className="text-red-500">Presupuestos</span>
                            </span>
                        </a>

                        <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-white/65 sm:text-base">
                            Creá y gestioná presupuestos profesionales en minutos,
                            con una presentación clara y lista para enviar.
                        </p>
                    </div>

                    <nav aria-label="Enlaces rápidos del footer">
                        <h2 className="mb-5 text-lg font-semibold text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]">
                            Enlaces Rápidos
                        </h2>

                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={(event) =>
                                            scrollToSection(event, link.href)
                                        }
                                        className="text-sm font-medium text-white/65 transition-colors duration-300 hover:text-red-500 focus:outline-none focus:text-red-500 sm:text-base"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}

                            <li>
                                <Link
                                    to="/politica-de-privacidad"
                                    className="text-sm font-medium text-white/65 transition-colors duration-300 hover:text-red-500 focus:outline-none focus:text-red-500 sm:text-base"
                                >
                                    Política de Privacidad
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/terminos-y-condiciones"
                                    className="text-sm font-medium text-white/65 transition-colors duration-300 hover:text-red-500 focus:outline-none focus:text-red-500 sm:text-base"
                                >
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div>
                        <h2 className="mb-5 text-lg font-semibold text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]">
                            Contacto
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-white/65 sm:text-base">
                                <Phone
                                    size={18}
                                    className="shrink-0 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]"
                                />
                                <span>+54 11 3586-2514</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm font-medium text-white/65 sm:text-base">
                                <Mail
                                    size={18}
                                    className="shrink-0 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]"
                                />
                                <span className="break-all">
                                    MTPresupuestos@presupuestos.com
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-sm font-medium text-white/65 sm:text-base">
                                <MapPin
                                    size={18}
                                    className="shrink-0 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]"
                                />
                                <span>Buenos Aires, Argentina</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-8 text-center">
                    <p className="text-sm text-white/55">
                        © {currentYear} MT Presupuestos. Todos los derechos
                        reservados.
                    </p>

                    <p className="mt-2 text-sm text-white/45">
                        Creado y desarrollado por{" "}
                        <a
                            href="https://www.linkedin.com/in/toni-riveros316321/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-red-500 transition-colors duration-300 hover:text-red-400 focus:outline-none focus:text-red-400"
                        >
                            Antonio Riveros
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
