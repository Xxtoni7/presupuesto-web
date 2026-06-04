import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PublicRoute;