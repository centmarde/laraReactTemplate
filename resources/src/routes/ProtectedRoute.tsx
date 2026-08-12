import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated, useAuthStore } from "../auth/auth-store";

/**
 * Guards private pages. If the user is not authenticated they are redirected
 * to the login screen; otherwise the child route is rendered.
 */
const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
