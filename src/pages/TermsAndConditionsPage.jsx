import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.webp";
import termsAndConditionsText from "../content/terms-and-conditions.txt?raw";

const INTERNAL_HEADINGS = new Set([
    "Mejora de plan",
    "Cambio a un plan inferior",
]);

const TERMS_AND_CONDITIONS_CONTENT = termsAndConditionsText
    .replaceAll('\r\n', "\n")
    .replaceAll('\r', "\n")
    .trim();

function renderTermsBlock(block, index) {
    if (index === 0) {
        return (
            <h1
                key={`terms-title-${index}`}
                className="text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl"
            >
                {block}
            </h1>
        );
    }

    if (block.startsWith("Última actualización:")) {
        return (
            <p
                key={`terms-update-${index}`}
                className="mt-5 inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800"
            >
                {block}
            </p>
        );
    }

    if (/^\d+\.\d+\./u.test(block)) {
        return (
            <h3
                key={`terms-subheading-${index}`}
                className="mt-9 text-xl font-bold tracking-[-0.025em] text-slate-900 sm:text-2xl"
            >
                {block}
            </h3>
        );
    }

    if (/^\d+\./u.test(block)) {
        return (
            <h2
                key={`terms-heading-${index}`}
                className="mt-12 border-t border-red-950/10 pt-10 text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-3xl"
            >
                {block}
            </h2>
        );
    }

    if (INTERNAL_HEADINGS.has(block)) {
        return (
            <h3
                key={`terms-internal-heading-${index}`}
                className="mt-7 text-lg font-bold text-red-800 sm:text-xl"
            >
                {block}
            </h3>
        );
    }

    const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length > 1) {
        return (
            <ul
                key={`terms-list-${index}`}
                className="mt-5 list-disc space-y-2.5 pl-5 text-base font-medium leading-7 text-slate-700 marker:text-red-600"
            >
                {lines.map((line, lineIndex) => (
                    <li key={`${line}-${lineIndex}`}>
                        {line}
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <p
            key={`terms-paragraph-${index}`}
            className="mt-5 text-base font-medium leading-7 text-slate-700"
        >
            {block}
        </p>
    );
}

function TermsAndConditionsPage() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, []);

    const termsBlocks = TERMS_AND_CONDITIONS_CONTENT.split(
        /\n{2,}|(?=^\d+(?:\.\d+)?\. )/gmu,
    )
        .map((block) => block.trim())
        .filter(Boolean);

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-950">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        aria-label="Volver a MT Presupuestos"
                        className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/40"
                    >
                        <img
                            src={logo}
                            alt="Logo de MT Presupuestos"
                            className="h-10 w-10 object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.35)] sm:h-12 sm:w-12"
                        />

                        <span className="hidden text-sm font-bold sm:block sm:text-lg">
                            MT PRESUPUESTOS
                        </span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 sm:px-4 sm:text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />

                        <span>Volver al inicio</span>
                    </Link>
                </div>
            </header>

            <main className="relative flex-1 overflow-hidden bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <article className="relative z-10 mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                    {termsBlocks.map(renderTermsBlock)}
                </article>
            </main>

            <footer className="border-t border-white/10 bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <img
                            src={logo}
                            alt="Logo de MT Presupuestos"
                            className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.25)]"
                        />

                        <div>
                            <p className="text-sm font-bold">
                                MT Presupuestos
                            </p>

                            <p className="text-xs font-medium text-white/50">
                                Presupuestos profesionales en minutos.
                            </p>
                        </div>
                    </Link>

                    <p className="text-sm font-medium text-white/55">
                        © {new Date().getFullYear()} MT Presupuestos
                    </p>

                    <Link
                        to="/"
                        className="text-sm font-semibold text-white/75 transition hover:text-white"
                    >
                        Volver al sitio principal
                    </Link>
                </div>
            </footer>
        </div>
    );
}

export default TermsAndConditionsPage;