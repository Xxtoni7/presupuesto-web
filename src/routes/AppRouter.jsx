import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import CompaniesPage from "../pages/CompaniesPage";
import PresupuestosPage from "../pages/PresupuestosPage";
import SettingsPage from "../pages/SettingsPage";
import CompanyPresupuestosPage from "../pages/CompanyPresupuestosPage";
import PresupuestoFormPage from "../pages/PresupuestoFormPage";

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
                    path="/companies/:companyId/budgets"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <CompanyPresupuestosPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/companies/:companyId/budgets/new"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <PresupuestoFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/companies/:companyId/budgets/:presupuestoId/edit"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <PresupuestoFormPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/budgets"
                    element={
                        <ProtectedRoute>
                        <MainLayout>
                            <PresupuestosPage />
                        </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                        <MainLayout>
                            <SettingsPage />
                        </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;