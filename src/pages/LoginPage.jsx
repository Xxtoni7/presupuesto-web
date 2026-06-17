import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import PasswordInput from "../components/auth/PasswordInput";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";


function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    const redirectTo = location.state?.from?.pathname || "/dashboard";

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const email = formData.email.trim();
        const password = formData.password;

        if (!email || !password) {
            setError("Ingresá tu email y contraseña para continuar.");
            return;
        }

        try {
            setLoading(true);

            await login(email, password);

            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message || "No se pudo iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credential) => {
        setError("");

        try {
            setGoogleLoading(true);

            await loginWithGoogle(credential);

            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message || "No se pudo iniciar sesión con Google.");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = (err) => {
        setError(err.message || "No se pudo cargar Google Login.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                    </div>

                    <CardTitle className="text-2xl">Generar Presupuesto</CardTitle>
                    <p className="text-gray-500 mt-2">
                        Ingresá tus credenciales para continuar
                    </p>
                </CardHeader>

                <CardContent>

                    {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="su@email.com"
                                required
                                className="mt-1.5"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Contraseña</Label>

                            <PasswordInput
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="********"
                                required
                                className="mt-1.5"
                            />

                            <div className="mt-2 text-left">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-gray-500 hover:text-red-500"
                                >
                                    ¿Te olvidaste la contraseña?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Iniciar sesión"
                            )}
                        </Button>

                        {googleLoading ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                                Iniciando sesión con Google...
                            </Button>
                        ) : (
                            <GoogleLoginButton
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                disabled={loading}
                            />
                        )}

                        <p className="text-center text-sm text-gray-500">
                            ¿Todavía no tenés cuenta?{" "}
                            <Link to="/register" className="font-medium text-red-500 hover:text-red-600">
                                Crear cuenta
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;