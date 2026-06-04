import { Link } from "react-router-dom";
import { FileText, Building2, Download, CheckCircle, Zap, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import logo from "../assets/logo.png";

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.1), 0 0 40px rgba(239, 68, 68, 0); }
                    50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.2); }
                }
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-glow { animation: glow 3s ease-in-out infinite; }
                .animate-shine { animation: shine 3s infinite; }
                .animate-slide-in-down { animation: slideInDown 0.8s ease-out; }
                .animate-slide-in-up { animation: slideInUp 0.8s ease-out; }
                .animate-fade-in { animation: fadeIn 1s ease-out; }
                .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
                .delay-400 { animation-delay: 400ms; }

                .gradient-text {
                    background: linear-gradient(135deg, #ef4444 0%, #f97316 50%, #d97706 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .card-shine {
                    position: relative;
                    overflow: hidden;
                }
                .card-shine::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shine 3s infinite;
                }
            `}</style>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
            </div>

            <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3 animate-slide-in-down">
                    <img src={logo} alt="Logo" className="h-10 w-10 object-contain filter drop-shadow-lg" />
                    <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        Presupuesto WEB
                    </span>
                </div>

                <div className="flex items-center gap-3 animate-slide-in-down" style={{ animationDelay: '100ms' }}>
                    <Link to="/login">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                            Iniciar sesión
                        </Button>
                    </Link>

                    <Link to="/register">
                        <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all duration-300">
                            Empezar gratis
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center md:py-24">
                <div className="animate-slide-in-down delay-100">
                    <span className="inline-block mb-5 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 px-4 py-2 text-sm font-medium text-red-300 border border-red-500/30 backdrop-blur-sm hover:bg-red-500/30 transition-all duration-300">
                        ⚡ Creá presupuestos profesionales en minutos
                    </span>
                </div>

                <h1 className="max-w-3xl text-4xl md:text-6xl font-bold tracking-tight text-white animate-slide-in-down delay-200 leading-tight">
                    Generá, guardá y descargá
                    <span className="gradient-text block"> presupuestos profesionales</span>
                    sin complicarte.
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-gray-300 animate-slide-in-down delay-300 leading-relaxed">
                    Organizá tus empresas, cargá ítems, visualizá el presupuesto y descargalo en PDF con un flujo simple y rápido.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-slide-in-down delay-400">
                    <Link to="/register">
                        <Button className="h-12 px-8 bg-gradient-to-r from-red-500 via-red-500 to-orange-500 text-white font-semibold hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300">
                            Empezar gratis →
                        </Button>
                    </Link>

                    <Link to="/login">
                        <Button variant="outline" className="h-12 px-8 border-white/30 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 font-semibold">
                            Ya tengo cuenta
                        </Button>
                    </Link>
                </div>

                <section className="mt-20 w-full">
                    <div className="grid gap-6 md:grid-cols-3 mb-8">
                        {[
                            { icon: Building2, title: "Cargá tu empresa", desc: "Guardá logo, colores y datos para reutilizarlos en tus presupuestos.", delay: "delay-100" },
                            { icon: FileText, title: "Creá presupuestos", desc: "Agregá cliente, descripción, ítems, materiales, mano de obra y cantidades.", delay: "delay-200" },
                            { icon: Download, title: "Descargá en PDF", desc: "Exportá presupuestos listos para enviar a tus clientes.", delay: "delay-300" }
                        ].map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`group relative animate-slide-in-up ${feature.delay}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="card-shine relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 text-left shadow-2xl hover:border-white/30 hover:from-white/20 hover:to-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
                                        <Icon className="mb-5 h-8 w-8 text-red-400 group-hover:scale-110 group-hover:text-red-300 transition-all duration-300" />
                                        <h3 className="text-lg font-bold text-white group-hover:text-red-100 transition-colors duration-300">{feature.title}</h3>
                                        <p className="mt-3 text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                            {feature.desc}
                                        </p>
                                        <div className="mt-4 h-1 w-0 bg-gradient-to-r from-red-500 to-orange-500 group-hover:w-8 transition-all duration-500"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm">
                    {[
                        { icon: CheckCircle, text: "Plan Free incluido" },
                        { icon: Zap, text: "Sin configuración larga" },
                        { icon: Lock, text: "Flujo rápido y seguro" }
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="animate-slide-in-up" style={{ animationDelay: `${400 + idx * 100}ms` }}>
                                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                    <Icon className="h-5 w-5 text-red-400" />
                                    {item.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 relative w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent rounded-full"></div>
            </main>
        </div>
    );
}

export default LandingPage;