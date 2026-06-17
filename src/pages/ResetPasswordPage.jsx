import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import PasswordInput from "../components/auth/PasswordInput";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { resetPassword } from "../api/authApi";
import { isValidPassword, PASSWORD_REQUIREMENTS_MESSAGE } from "../utils/passwordValidation";
import logo from "../assets/logo.png";

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });

    const hasValidLink = Boolean(userId && token);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!hasValidLink) {
            setError("El link es inválido o está incompleto.");
            return;
        }

        const newPassword = formData.newPassword;
        const confirmNewPassword = formData.confirmNewPassword;

        if (!isValidPassword(newPassword)) {
            setError(PASSWORD_REQUIREMENTS_MESSAGE);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);

            const data = await resetPassword({
                userId,
                token,
                newPassword,
                confirmNewPassword,
            });

            setMessage(data?.message || "");
            setFormData({
                newPassword: "",
                confirmNewPassword: "",
            });

            globalThis.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2200);
        } catch (err) {
            setError(
                err.message ||
                    "No pudimos restablecer la contraseña. El link es inválido o expiró."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-16 h-16 object-contain"
                        />
                    </div>

                    <CardTitle className="text-2xl">
                        Restablecer contraseña
                    </CardTitle>

                    <p className="text-gray-500 mt-2">
                        Ingresá una nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>
                </CardHeader>

                <CardContent>
                    {hasValidLink ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                            <div>
                                <Label htmlFor="newPassword">
                                    Nueva contraseña
                                </Label>

                                <PasswordInput
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                    className="mt-1.5"
                                    disabled={loading || Boolean(message)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirmNewPassword">
                                    Confirmar nueva contraseña
                                </Label>

                                <PasswordInput
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    placeholder="********"
                                    required
                                    className="mt-1.5"
                                    disabled={loading || Boolean(message)}
                                />
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
                                {PASSWORD_REQUIREMENTS_MESSAGE}
                            </div>

                            {message && (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                    <div className="flex gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{message}</span>
                                    </div>

                                    <p className="mt-2 text-xs text-emerald-700/80">
                                        Te estamos redirigiendo al login...
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                                disabled={loading || Boolean(message)}
                            >
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Restableciendo contraseña...
                                    </>
                                ) : (
                                    "Restablecer contraseña"
                                )}
                            </Button>

                            <p className="text-center text-sm text-gray-500">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1 font-medium text-red-500 hover:text-red-600"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver al login
                                </Link>
                            </p>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                <div className="flex gap-3">
                                    <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

                                    <div>
                                        <p className="font-semibold">
                                            Link inválido
                                        </p>

                                        <p className="mt-1">
                                            El link para restablecer la contraseña es inválido o está incompleto.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Solicitar un nuevo link
                            </Button>

                            <p className="text-center text-sm text-gray-500">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1 font-medium text-red-500 hover:text-red-600"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver al login
                                </Link>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ResetPasswordPage;