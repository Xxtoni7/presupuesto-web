import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import gsap from "gsap";
import { Button } from "../ui/button";
import logo from "../../assets/logo.webp";
import fondo from "../../assets/hero/fondo.jpg";
import fotoHome from "../../assets/hero/fotoHome.png";

function Hero({ loginPath, registerPath }) {
    const heroRef = useRef(null);
    const logoWrapperRef = useRef(null);
    const logoFloatRef = useRef(null);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const actionsRef = useRef(null);
    const previewRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const introElements = [
                titleRef.current,
                subtitleRef.current,
                actionsRef.current,
                previewRef.current,
            ].filter(Boolean);

            gsap.set(logoWrapperRef.current, {
                autoAlpha: 0,
                y: 24,
                scale: 0.92,
            });

            gsap.set(introElements, {
                autoAlpha: 0,
                y: 18,
            });

            gsap.timeline({
                defaults: { ease: "power3.out" },
            })
                .to(logoWrapperRef.current, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                })
                .to(
                    introElements,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        stagger: 0.12,
                    },
                    "-=0.35",
                );

            gsap.to(logoFloatRef.current, {
                y: -8,
                duration: 3.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="relative">
            <section
                ref={heroRef}
                className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-start overflow-hidden bg-black px-4 pb-24 pt-24 text-center sm:justify-center sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-36"
            >
                <img
                    src={fondo}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
                />

                <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
                    <div className="flex min-h-[calc(100svh-6rem)] w-full flex-col items-center justify-start sm:justify-center">
                        <div className="relative z-10 -mt-25 sm:-mt-60 lg:-mt-40">
                            <div
                                ref={logoWrapperRef}
                                className="w-[145px] sm:w-[175px] lg:w-[210px]"
                            >
                                <div ref={logoFloatRef} className="relative aspect-square w-full">
                                    <div className="landing-logo-stage h-full w-full">
                                        <div className="landing-logo-reaction" aria-hidden="true">
                                            <div />
                                            <div />
                                            <div />
                                        </div>

                                        <img
                                            src={logo}
                                            alt="Logo de MT Presupuestos"
                                            className="landing-logo-image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto mb-20 flex w-full translate-y-10 flex-col items-center sm:mt-8 sm:mb-0 lg:translate-y-14">
                            <div className="relative -top-6 sm:top-0">
                                <div ref={titleRef} className="max-w-3xl">
                                    <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                                        MT - PRESUPUESTOS
                                    </h1>
                                </div>

                                <div ref={subtitleRef} className="mt-4 max-w-2xl sm:mt-3">
                                    <p className="text-sm font-medium leading-5 text-white/85 sm:text-lg sm:leading-normal lg:text-xl">
                                        Creá y gestioná presupuestos profesionales en minutos.
                                    </p>
                                </div>
                            </div>

                            <div
                                ref={actionsRef}
                                className="mt-10 flex w-full max-w-[335px] flex-row gap-2.5 sm:mt-5 sm:w-auto sm:max-w-none sm:justify-center"
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-10 flex-1 bg-red-600 px-3 text-xs font-semibold text-white shadow-lg shadow-red-600/35 hover:bg-red-700 sm:h-11 sm:flex-none sm:px-7 sm:text-sm"
                                >
                                    <Link to={registerPath}>Empezar gratis</Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-10 flex-1 border-white/15 bg-white/10 px-3 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-white/15 hover:text-white sm:h-11 sm:flex-none sm:px-7 sm:text-sm"
                                >
                                    <Link to={loginPath}>Iniciar sesión</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={previewRef}
                        className="-mt-10 hidden w-full max-w-6xl px-4 lg:block"
                    >
                        <div className="relative overflow-hidden rounded-[2rem] border border-red-400/25 bg-red-950/10 p-[1px] shadow-[0_35px_120px_rgba(127,29,29,0.38)] backdrop-blur-xl">
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(239,68,68,0.45),rgba(255,255,255,0.06)_38%,rgba(127,29,29,0.3))] opacity-70" />

                            <div className="relative overflow-hidden rounded-[1.95rem] border border-white/10 bg-black/35 p-2">
                                <img
                                    src={fotoHome}
                                    alt="Vista previa de MT Presupuestos"
                                    className="block w-full rounded-[1.45rem] border border-white/10 object-cover shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

Hero.propTypes = {
    loginPath: PropTypes.string.isRequired,
    registerPath: PropTypes.string.isRequired,
};

export default Hero;