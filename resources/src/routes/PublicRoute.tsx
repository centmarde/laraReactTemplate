import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated, useAuthStore } from "../auth/auth-store";

/**
 * Guards public pages (login / register). Already-authenticated users are sent
 * to the dashboard. The pending 2FA step stays visible because a user with a
 * pending SMS code is not yet considered "authenticated".
 */
const PublicRoute = () => {
    const isAuthenticated = useAuthStore(selectIsAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
