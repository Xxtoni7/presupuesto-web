import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { forgotPassword } from "../api/authApi";
import logo from "../assets/logo.png";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            return;
        }

        try {
            setLoading(true);

            const data = await forgotPassword(normalizedEmail);

            setMessage(data?.message || "");
            setEmail("");
        } catch (err) {
            setError(err.message || "No pudimos enviar las instrucciones.");
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
                        Recuperar contraseña
                    </CardTitle>

                    <p className="text-gray-500 mt-2">
                        Ingresá tu email y te enviaremos las instrucciones.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {message && (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Enviando instrucciones...
                                </>
                            ) : (
                                "Enviar instrucciones"
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
                </CardContent>
            </Card>
        </div>
    );
}

export default ForgotPasswordPage;