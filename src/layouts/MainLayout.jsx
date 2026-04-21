import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { useSearch } from "../context/SearchContext";

function MainLayout({ children }) {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const menu = [
        { name: "Inicio", path: "/", icon: Home },
        { name: "Empresas", path: "/companies", icon: Building2 },
        { name: "Presupuestos", path: "/budgets", icon: FileText },
        { name: "Configuración", path: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const { searchTerm, setSearchTerm } = useSearch();

    return (
        <div className="min-h-screen bg-[#f8f8f8]">
            <div className="flex min-h-screen">
                <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col">
                    <div className="h-[64px] border-b border-gray-200 flex items-center px-6 gap-3">
                        <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
                        <span className="text-[18px] font-semibold">Presupuesto WEB</span>
                    </div>

                    <nav className="p-5 space-y-3">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-[16px] transition ${
                                    isActive
                                    ? "bg-red-500 text-white font-semibold"
                                    : "text-black hover:bg-gray-100"
                                }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 flex flex-col">
                    <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6">
                        <div className="relative w-full max-w-[480px] mx-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6b7280]" />

                            <input
                                type="text"
                                placeholder="Buscar presupuestos, empresas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 rounded-xl border border-[#d1d5db] bg-white pl-10 pr-4 text-[14px] text-[#111111] placeholder:text-[#6b7280] shadow-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                            />
                        </div>

                        <div className="relative ml-6">
                            <button
                                type="button"
                                onClick={() => setOpenUserMenu((prev) => !prev)}
                                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <User className="h-5 w-5 text-black" />
                        </button>

                        {openUserMenu && (
                            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                                <div className="mb-4">
                                    <p className="text-[16px] font-semibold text-black">
                                        Antonio Riveros
                                    </p>
                                    <p className="text-[15px] text-gray-500">
                                        test@test.com
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-red-500 text-[16px] font-medium"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                        </div>
                    </header>

                <main className="flex-1 p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;