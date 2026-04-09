import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                path="/"
                element={
                    <ProtectedRoute>
                    <DashboardPage />
                    </ProtectedRoute>
                }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;