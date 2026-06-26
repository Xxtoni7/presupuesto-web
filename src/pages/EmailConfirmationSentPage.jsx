import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { resendEmailConfirmation } from "../api/authApi";
import logo from "../assets/logo.webp";

const UNEXPECTED_ERROR_MESSAGE =
    "No pudimos completar la solicitud.";

function EmailConfirmationSentPage() {
    const location = useLocation();

    const initialEmail = location.state?.email || "";
    const initialMessage = location.state?.message || "";

    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            setError("Ingresá tu email para reenviar la verificación.");
            return;
        }

        try {
            setLoading(true);

            const data = await resendEmailConfirmation(normalizedEmail);

            setMessage(data?.message || "");
        } catch (err) {
            setError(err.message || UNEXPECTED_ERROR_MESSAGE);
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
                        Verificá tu email
                    </CardTitle>

                    <p className="text-gray-500 mt-2">
                        Te enviamos un enlace para activar tu cuenta.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {message && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                {message}
                            </div>
                        )}

                        {!message && (
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                                Revisá tu casilla de email y seguí las instrucciones para activar tu cuenta.
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="su@email.com"
                                required
                                className="mt-1.5"
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Reenviando email...
                                </>
                            ) : (
                                "Reenviar email de verificación"
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

                        <p className="text-center text-sm text-gray-500">
                            ¿Necesitás crear otra cuenta?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-red-500 hover:text-red-600"
                            >
                                Volver al registro
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default EmailConfirmationSentPage;