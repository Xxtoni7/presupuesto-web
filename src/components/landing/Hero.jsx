import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import gsap from "gsap";
import { Button } from "../ui/button";
import logo from "../../assets/logo.webp";

function Hero({ loginPath, registerPath }) {
    const heroRef = useRef(null);
    const logoWrapperRef = useRef(null);
    const logoFloatRef = useRef(null);

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const actionsRef = useRef(null);
    const backgroundGlowRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const introElements = [
                titleRef.current,
                subtitleRef.current,
                actionsRef.current,
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

            gsap.to(backgroundGlowRef.current, {
                scale: 1.08,
                x: 18,
                y: -12,
                duration: 5.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="relative h-full">
            <section
                ref={heroRef}
                className="relative mx-auto flex h-[100svh] max-w-6xl flex-col items-center justify-start overflow-hidden px-4 pb-5 pt-24 text-center sm:justify-center sm:px-6 sm:pt-24 lg:px-8"
            >
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07070a_0%,#14070a_38%,#050507_100%)]" />

                <div
                    ref={backgroundGlowRef}
                    className="pointer-events-none absolute left-1/2 top-[15%] -z-10 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-red-600/25 blur-[120px] sm:h-[34rem] sm:w-[34rem] lg:h-[44rem] lg:w-[44rem]"
                />

                <div className="pointer-events-none absolute left-[8%] top-[18%] -z-10 h-72 w-72 rounded-full bg-rose-900/20 blur-[120px]" />
                <div className="pointer-events-none absolute right-[8%] top-[22%] -z-10 h-80 w-80 rounded-full bg-red-700/15 blur-[120px]" />
                <div className="pointer-events-none absolute left-1/2 bottom-[-5rem] -z-10 h-56 w-[46rem] -translate-x-1/2 rounded-full bg-red-500/14 blur-[95px]" />

                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.07),transparent_18rem),radial-gradient(circle_at_18%_20%,rgba(239,68,68,0.12),transparent_22rem),radial-gradient(circle_at_82%_30%,rgba(127,29,29,0.16),transparent_24rem)]" />

                <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

                <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(127,29,29,0.2),transparent_30%,transparent_65%,rgba(239,68,68,0.08)),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_36%,rgba(0,0,0,0.42))]" />

                <div className="relative z-10 mt-20 sm:mt-0">
                    <div
                        ref={logoWrapperRef}
                        className="w-[215px] sm:w-[285px] lg:w-[345px]"
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

                <div className="mt-auto mb-20 flex w-full flex-col items-center sm:mt-4 sm:mb-0">
                    <div className="relative -top-6 sm:top-0">
                        <div ref={titleRef} className="max-w-3xl">
                            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                                MT - PRESUPUESTOS
                            </h1>
                        </div>

                        <div ref={subtitleRef} className="mt-4 max-w-2xl sm:mt-3">
                            <p className="text-sm font-medium leading-5 text-white/85 sm:text-lg sm:leading-normal lg:text-xl">
                                Creá presupuestos profesionales en minutos.
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
            </section>
        </main>
    );
}

Hero.propTypes = {
    loginPath: PropTypes.string.isRequired,
    registerPath: PropTypes.string.isRequired,
};

export default Hero;