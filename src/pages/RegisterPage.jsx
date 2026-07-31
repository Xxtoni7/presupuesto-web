import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import PasswordInput from "../components/auth/PasswordInput";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.webp";
import { isValidPassword, PASSWORD_REQUIREMENTS_MESSAGE } from "../utils/passwordValidation";

function RegisterPage() {
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

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
        const confirmPassword = formData.confirmPassword;

        if (!email || !password || !confirmPassword) {
            setError("Completá todos los campos para crear tu cuenta.");
            return;
        }

        if (!isValidPassword(password)) {
            setError(PASSWORD_REQUIREMENTS_MESSAGE);
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);

            const data = await register({
                email,
                password,
                confirmPassword,
            });

            navigate("/email-confirmation-sent", {
                replace: true,
                state: {
                    email,
                    message: data?.message,
                },
            });
        } catch (err) {
            setError(err.message || "No se pudo crear la cuenta.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credential) => {
        setError("");

        try {
            setGoogleLoading(true);

            await loginWithGoogle(credential);

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "No se pudo crear la cuenta con Google.");
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

                    <CardTitle className="text-2xl">Crear cuenta</CardTitle>
                    <p className="text-gray-500 mt-2">
                        Empezá gratis y creá tu primer presupuesto
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
                                disabled={loading || googleLoading}
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
                                disabled={loading || googleLoading}
                            />
                            
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">
                                Confirmar contraseña
                            </Label>

                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repetí tu contraseña"
                                required
                                className="mt-1.5"
                                disabled={loading || googleLoading}
                            />
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
                            {PASSWORD_REQUIREMENTS_MESSAGE}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                            disabled={loading || googleLoading}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear cuenta gratis"
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
                                Creando cuenta con Google...
                            </Button>
                        ) : (
                            <GoogleLoginButton
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                disabled={loading}
                            />
                        )}

                        <p className="text-center text-sm text-gray-500">
                            ¿Ya tenés cuenta?{" "}
                            <Link to="/login" className="font-medium text-red-500 hover:text-red-600">
                                Iniciar sesión
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterPage;
