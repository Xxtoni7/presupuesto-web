import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, CheckCircle2, ClipboardList, FileDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ROADMAP_STEPS = [
    {
        number: "1",
        title: "Cargá tu empresa",
        description: "Dejá lista tu identidad.",
        icon: Building2,
        details: [
            "Datos de empresa",
            "Logo y colores",
            "Información lista",
        ],
        theme: {
            circleBorder: "border-red-600/70",
            iconText: "text-red-700",
            titleText: "text-slate-950",
            descriptionText: "text-red-700",
            detailIconBorder: "border-[#e4aaa0]/80",
            detailIconBg: "bg-red-600",
            detailIconShadow: "shadow-[0_18px_45px_rgba(220,38,38,0.25)]",
            detailText: "text-red-800",
        },
    },
    {
        number: "2",
        title: "Armá el presupuesto",
        description: "Detallá trabajos y totales.",
        icon: ClipboardList,
        details: [
            "Cliente y detalle",
            "Trabajos y cantidades",
            "Totales claros",
        ],
        theme: {
            circleBorder: "border-amber-500/80",
            iconText: "text-amber-600",
            titleText: "text-slate-950",
            descriptionText: "text-amber-700",
            detailIconBorder: "border-amber-200/80",
            detailIconBg: "bg-amber-500",
            detailIconShadow: "shadow-[0_18px_45px_rgba(245,158,11,0.25)]",
            detailText: "text-amber-800",
        },
    },
    {
        number: "3",
        title: "Exportá el PDF",
        description: "Generá un PDF profesional.",
        icon: FileDown,
        details: [
            "PDF profesional",
            "Listo para enviar",
            "Imagen más prolija",
        ],
        theme: {
            circleBorder: "border-emerald-600/70",
            iconText: "text-emerald-700",
            titleText: "text-slate-950",
            descriptionText: "text-emerald-700",
            detailIconBorder: "border-emerald-200/80",
            detailIconBg: "bg-emerald-600",
            detailIconShadow: "shadow-[0_18px_45px_rgba(5,150,105,0.25)]",
            detailText: "text-emerald-800",
        },
    },
];

function Roadmap() {
    const roadmapRef = useRef(null);
    const introRef = useRef(null);
    const mobileLineProgressRef = useRef(null);
    const lineProgressRef = useRef(null);
    const stepRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const introElements = introRef.current?.querySelectorAll(".roadmap-intro-animate");

            if (introElements?.length) {
                gsap.fromTo(
                    introElements,
                    {
                        autoAlpha: 0,
                        y: 34,
                        filter: "blur(10px)",
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.85,
                        stagger: 0.14,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: introRef.current,
                            start: "top 78%",
                            toggleActions: "play none none none",
                            once: true,
                        },
                    },
                );
            }

            const progressPaths = [
                mobileLineProgressRef.current,
                lineProgressRef.current,
            ].filter(Boolean);

            progressPaths.forEach((progressPath) => {
                const pathLength = progressPath.getTotalLength();

                gsap.set(progressPath, {
                    strokeDasharray: pathLength,
                    strokeDashoffset: pathLength,
                });

                gsap.to(progressPath, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: roadmapRef.current,
                        start: "top 12%",
                        end: "bottom 80%",
                        scrub: true,
                    },
                });
            });

            stepRefs.current.forEach((step) => {
                if (!step) return;

                const circle = step.querySelector(".roadmap-circle");
                const items = step.querySelectorAll(".roadmap-item");

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: step,
                        start: "top 76%",
                        toggleActions: "play none none reverse",
                    },
                });

                timeline
                    .fromTo(
                        circle,
                        {
                            autoAlpha: 1,
                            y: 48,
                            scale: 0.86,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.75,
                            ease: "power3.out",
                        },
                    )
                    .fromTo(
                        items,
                        {
                            autoAlpha: 0,
                            x: 36,
                        },
                        {
                            autoAlpha: 1,
                            x: 0,
                            duration: 0.55,
                            stagger: 0.12,
                            ease: "power3.out",
                        },
                        "-=0.35",
                    );
            });
        }, roadmapRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={roadmapRef}
            aria-labelledby="roadmap-title"
            className="relative min-h-[90svh] overflow-hidden bg-[#EEE1DA] text-slate-950"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-48 bg-[linear-gradient(180deg,rgba(5,5,7,0.62)_0%,rgba(74,9,15,0.42)_34%,rgba(199,146,135,0.18)_62%,rgba(246,232,226,0)_100%)]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-red-950/25" />

            <div className="pointer-events-none absolute left-[-10rem] top-28 h-80 w-80 rounded-full bg-red-400/5 blur-[120px]" />
            <div className="pointer-events-none absolute right-[-12rem] top-[38%] h-96 w-96 rounded-full bg-orange-100/10 blur-[140px]" />
            <div className="pointer-events-none absolute left-1/2 bottom-[-5rem] h-72 w-[46rem] -translate-x-1/2 rounded-full bg-white/18 blur-[120px]" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_52%,rgba(239,68,68,0.07),transparent_24rem),radial-gradient(circle_at_82%_72%,rgba(251,146,60,0.08),transparent_26rem)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start px-4 pb-32 pt-44 text-left sm:px-6 sm:pt-48 lg:px-8 lg:pt-[22rem]">
                <div ref={introRef} className="max-w-[760px]">     
                    <h2
                        id="roadmap-title"
                        className="roadmap-intro-animate mt-6 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
                    >
                        ¿Cansado de tardar tanto haciendo{" "}
                        <span className="relative inline-block text-red-800">
                            <span className="relative z-10">presupuestos?</span>
                            <span
                                aria-hidden="true"
                                className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-black/40"
                            />
                        </span>
                    </h2>

                    <p className="roadmap-intro-animate mt-5 max-w-2xl text-base font-medium leading-7 text-slate-700 sm:text-lg">
                        Con MT Presupuestos pasás de cargar tus datos a exportar un PDF profesional en pocos minutos, sin complicarte con planillas ni diseños desde cero.
                    </p>
                </div>

                <div className="relative mt-20 w-full pb-10">
                    {/* mobile: línea curva en S */}
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full lg:hidden"
                        viewBox="0 0 390 820"
                        fill="none"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M125 95
                                C88 170 100 240 170 295
                                C245 355 292 415 265 505
                                C235 610 145 650 118 745"
                            stroke="transparent"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />

                        <path
                            ref={mobileLineProgressRef}
                            d="M125 95
                                C88 170 100 240 170 295
                                C245 355 292 415 265 505
                                C235 610 145 650 118 745"
                            stroke="#dc2626"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            className="drop-shadow-[0_0_14px_rgba(220,38,38,0.35)]"
                        />
                    </svg>

                    {/* desktop: línea curva en S */}
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
                        viewBox="0 0 1200 1600"
                        fill="none"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M380 170
                                C380 390 820 500 820 800
                                S380 1210 380 1460"
                            stroke="transparent"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />

                        <path
                            ref={lineProgressRef}
                            d="M380 170
                                C380 390 820 500 820 800
                                S380 1210 380 1460"
                            stroke="#dc2626"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            className="drop-shadow-[0_0_14px_rgba(220,38,38,0.35)]"
                        />
                    </svg>

                    <div className="relative z-10 space-y-24 lg:space-y-32">
                        {ROADMAP_STEPS.map((step, index) => {
                            const StepIcon = step.icon;
                            const isEven = index % 2 === 0;
                            const theme = step.theme;

                            return (
                                <article
                                    key={step.number}
                                    ref={(element) => {
                                        stepRefs.current[index] = element;
                                    }}
                                    className="relative grid min-h-[300px] grid-cols-2 items-center gap-3 lg:min-h-[420px] lg:grid-cols-2 lg:gap-16 lg:pl-0"
                                >
                                    <div
                                        className={`roadmap-circle relative z-20 flex h-44 w-44 flex-col items-center justify-center rounded-full border-[5px] border-double ${theme.circleBorder} bg-[#f1d9cf] p-5 text-center shadow-[0_18px_55px_rgba(127,29,29,0.14)] backdrop-blur-xl sm:h-44 sm:w-44 lg:h-80 lg:w-80 lg:border-[7px] lg:p-8 lg:shadow-[0_28px_90px_rgba(127,29,29,0.18)] ${
                                            isEven
                                                ? "justify-self-start lg:justify-self-end"
                                                : "col-start-2 justify-self-end lg:col-start-2 lg:justify-self-start"
                                        }`}
                                    >
                                        <StepIcon className={`mb-2 h-9 w-9 ${theme.iconText} lg:mb-4 lg:h-16 lg:w-16`} />

                                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.iconText} lg:text-xs lg:tracking-[0.28em]`}>
                                            Paso {step.number}
                                        </span>

                                        <h3 className={`mt-2 text-[18px] font-bold leading-tight tracking-[-0.04em] ${theme.titleText} lg:mt-3 lg:text-2xl`}>
                                            {step.title}
                                        </h3>

                                        <p className={`mt-3 hidden text-sm font-medium leading-6 ${theme.descriptionText} lg:block`}>
                                            {step.description}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex w-full max-w-none flex-col gap-2 lg:max-w-[520px] lg:gap-5 ${
                                            isEven
                                                ? "col-start-2 row-start-1 justify-self-end lg:col-start-2 lg:row-start-1 lg:justify-self-start"
                                                : "col-start-1 row-start-1 justify-self-start lg:col-start-1 lg:row-start-1 lg:justify-self-end"
                                        }`}
                                    >
                                        {step.details.map((detail) => (
                                            <div
                                                key={detail}
                                                className={`roadmap-item flex items-center ${
                                                    isEven ? "" : "flex-row-reverse"
                                                }`}
                                            >
                                                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[6px] ${theme.detailIconBorder} ${theme.detailIconBg} text-white ${theme.detailIconShadow} lg:h-16 lg:w-16 lg:border-[12px]`}>
                                                    <CheckCircle2 className="h-3.5 w-3.5 lg:h-6 lg:w-6" />
                                                </div>

                                                <div
                                                    className={`flex min-h-8 flex-1 items-center rounded-full border border-white/45 bg-white/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.04em] ${theme.detailText} shadow-[0_12px_35px_rgba(88,28,20,0.08)] backdrop-blur-xl lg:min-h-14 lg:px-6 lg:py-4 lg:text-sm lg:tracking-[0.08em] lg:shadow-[0_18px_60px_rgba(88,28,20,0.10)] ${
                                                        isEven
                                                            ? "-ml-3 pl-5 lg:-ml-5 lg:pl-9"
                                                            : "-mr-3 justify-end pr-5 text-right lg:-mr-5 lg:ml-0 lg:justify-end lg:pl-9 lg:pr-9 lg:text-right"
                                                    }`}
                                                >
                                                    {detail}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Roadmap;
