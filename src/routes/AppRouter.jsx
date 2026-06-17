import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "../layouts/MainLayout";
import CompaniesPage from "../pages/CompaniesPage";
import PresupuestosPage from "../pages/PresupuestosPage";
import SettingsPage from "../pages/SettingsPage";
import CompanyPresupuestosPage from "../pages/CompanyPresupuestosPage";
import PresupuestoFormPage from "../pages/PresupuestoFormPage";
import RegisterPage from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />

                <Route 
                    path="/forgot-password" 
                    element={<ForgotPasswordPage />} 
                />
                <Route 
                    path="/reset-password" 
                    element={<ResetPasswordPage />} 
                />

                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/dashboard"
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