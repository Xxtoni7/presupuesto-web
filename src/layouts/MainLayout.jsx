import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
    Home,
    Building2,
    FileText,
    Settings,
    Search,
    User,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.webp";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/useTheme";

function MainLayout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { resolvedTheme, setTheme } = useTheme();
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const userMenuRef = useRef(null);

    const menu = [
        { name: "Inicio", path: "/dashboard", icon: Home },
        { name: "Empresas", path: "/companies", icon: Building2 },
        { name: "Presupuestos", path: "/budgets", icon: FileText },
        { name: "Configuración", path: "/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            navigate("/login", { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const { searchTerm, setSearchTerm } = useSearch();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setOpenUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex min-h-screen">
                {isMobileMenuOpen && (
                    <button
                        type="button"
                        aria-label="Cerrar menú"
                        className="fixed inset-0 z-40 bg-black/40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <aside
                    className={`fixed inset-y-0 left-0 z-50 flex w-[260px] transform flex-col overflow-y-auto border-r border-border bg-card transition-transform duration-300 md:translate-x-0 ${
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="h-[64px] flex items-center justify-between px-4 md:px-6">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
                            <span className="hidden text-[18px] font-semibold md:inline">
                                MT Presupuestos
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-red-500 bg-card hover:bg-accent md:hidden"
                        >
                            <X className="h-5 w-5 text-foreground" />
                        </button>
                    </div>

                    <nav className="px-5 pt-7 pb-5 space-y-3">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-[16px] transition ${
                                        isActive
                                            ? "bg-red-500 text-white font-semibold"
                                            : "text-foreground hover:bg-accent"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 flex flex-col md:ml-[260px]">
                    <header className="flex h-[64px] items-center justify-between border-b border-border bg-card px-4 md:px-6">
                        <div className="flex w-10 items-center justify-start md:hidden">
                            <button
                                type="button"
                                aria-label="Abrir menú de navegación"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mx-3 flex min-w-0 flex-1 items-center justify-center gap-2 md:mx-auto md:gap-3">
                            <div className="relative w-full max-w-[480px]">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Buscar presupuestos, empresas..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-[14px] text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                />
                            </div>

                            <fieldset
                                className="relative flex h-10 w-[76px] shrink-0 items-center rounded-xl border border-input bg-card p-1.5 shadow-sm"
                                aria-label="Cambiar tema"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute left-1.5 top-1.5 h-7 w-8 rounded-lg border border-border bg-muted shadow-sm transition-transform duration-200 ease-out ${
                                        resolvedTheme === "dark"
                                            ? "translate-x-8"
                                            : "translate-x-0"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setTheme("light")}
                                    aria-label="Usar modo claro"
                                    aria-pressed={resolvedTheme === "light"}
                                    title="Modo claro"
                                    className={`relative z-10 flex h-7 w-8 items-center justify-center rounded-lg transition-colors ${
                                        resolvedTheme === "light"
                                            ? "text-amber-500"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Sun className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTheme("dark")}
                                    aria-label="Usar modo oscuro"
                                    aria-pressed={resolvedTheme === "dark"}
                                    title="Modo oscuro"
                                    className={`relative z-10 flex h-7 w-8 items-center justify-center rounded-lg transition-colors ${
                                        resolvedTheme === "dark"
                                            ? "text-blue-400"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Moon className="h-4 w-4" />
                                </button>
                            </fieldset>
                        </div>

                        <div
                            ref={userMenuRef}
                            className="relative flex w-10 items-center justify-end md:ml-3 md:w-auto"
                        >
                            <button
                                type="button"
                                aria-label="Abrir menú de usuario"
                                aria-expanded={openUserMenu}
                                onClick={() => setOpenUserMenu((prev) => !prev)}
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition ${
                                    openUserMenu
                                        ? "border-red-500 bg-accent ring-1 ring-red-500/20"
                                        : "border-input bg-card hover:bg-accent"
                                }`}
                            >
                                <User className="h-5 w-5 text-foreground" />
                            </button>

                            {openUserMenu && (
                                <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl">
                                    <div className="mb-4">
                                        <p className="break-all text-[16px] font-semibold text-foreground">
                                            {user?.email || "Usuario"}
                                        </p>

                                        <p className="text-[15px] text-muted-foreground">
                                            {user?.planName ? `Plan ${user.planName}` : "Plan actual"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="flex items-center gap-3 text-red-500 text-[16px] font-medium disabled:opacity-60"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;