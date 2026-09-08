import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/useAuth";
import AuthLoading from "../components/ui/AuthLoading";

function PublicRoute({ children }) {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    if (isLoadingAuth) {
        return <AuthLoading />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;
