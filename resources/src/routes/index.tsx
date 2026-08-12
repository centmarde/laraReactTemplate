import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingView from "../pages/landing-view";
import LoginView from "../pages/login-view";
import RegisterView from "../pages/register-view";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

/**
 * Client-side routing using the History API (clean URLs, no `#/`).
 *
 * Route * /login, /register  -> public, guarded by PublicRoute
 *       * /, /dashboard      -> protected, guarded by ProtectedRoute
 *       * *                  -> catch-all redirect to the dashboard
 *
 * NOTE: routes/web.php has a fallback that serves the SPA for any other path,
 * so deep links (e.g. /login) work on refresh instead of returning a 404.
 */
const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<LandingView />} />
                <Route path="/dashboard" element={<LandingView />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
