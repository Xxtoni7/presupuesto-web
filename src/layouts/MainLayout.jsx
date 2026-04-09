import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainLayout({ children }) {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* HEADER */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="font-bold text-lg">Generador de Presupuestos</h1>

                <nav className="flex gap-4">
                    <Link to="/">Dashboard</Link>
                    <Link to="/companies">Empresas</Link>
                    <Link to="/budgets">Presupuestos</Link>
                </nav>

                <button
                onClick={logout}
                className="bg-black text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </header>

            {/* CONTENIDO */}
            <main className="p-6">{children}</main>
        </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;