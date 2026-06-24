import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLoading from "../components/ui/AuthLoading";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CompaniesPage = lazy(() => import("../pages/CompaniesPage"));
const PresupuestosPage = lazy(() => import("../pages/PresupuestosPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const CompanyPresupuestosPage = lazy(() => import("../pages/CompanyPresupuestosPage"));
const PresupuestoFormPage = lazy(() => import("../pages/PresupuestoFormPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const EmailConfirmationSentPage = lazy(() => import("../pages/EmailConfirmationSentPage"));
const ConfirmEmailPage = lazy(() => import("../pages/ConfirmEmailPage"));

function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<AuthLoading />}>
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
                        path="/email-confirmation-sent"
                        element={<EmailConfirmationSentPage />}
                    />
                    <Route
                        path="/confirm-email"
                        element={<ConfirmEmailPage />}
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
            </Suspense>
        </BrowserRouter>
    );
}

export default AppRouter;