import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import CompaniesPage from "../pages/CompaniesPage";
import BudgetsPage from "../pages/BudgetsPage";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DashboardPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/companies"
                    element={
                        <ProtectedRoute>
                        <MainLayout>
                            <CompaniesPage />
                        </MainLayout>
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/budgets"
                    element={
                        <ProtectedRoute>
                        <MainLayout>
                            <BudgetsPage />
                        </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;