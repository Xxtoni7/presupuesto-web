import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function usePricingAnimations({ sectionRef, plansCount }) {
    useEffect(() => {
        if (!sectionRef.current || plansCount === 0) {
            return undefined;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".pricing-intro",
                {
                    autoAlpha: 0,
                    y: 28,
                    filter: "blur(8px)",
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 72%",
                        once: true,
                    },
                },
            );

            gsap.fromTo(
                ".pricing-card",
                {
                    autoAlpha: 0,
                    y: 42,
                    scale: 0.97,
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.14,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".pricing-grid",
                        start: "top 78%",
                        once: true,
                    },
                },
            );

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, [plansCount, sectionRef]);
}

export default usePricingAnimations;
