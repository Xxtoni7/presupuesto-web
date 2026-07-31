import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { confirmEmail } from "../api/authApi";
import logo from "../assets/logo.webp";

const INCOMPLETE_LINK_MESSAGE =
    "El link de verificación es inválido o está incompleto.";

function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();

    const userId = searchParams.get("userId") || searchParams.get("userid");
    const token = searchParams.get("token");

    const hasRequestedRef = useRef(false);

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (hasRequestedRef.current) return;

        hasRequestedRef.current = true;

        if (!userId || !token) {
            setStatus("error");
            setMessage(INCOMPLETE_LINK_MESSAGE);
            return;
        }

        const verifyEmail = async () => {
            try {
                const data = await confirmEmail({ userId, token });

                setStatus("success");
                setMessage(data?.message || "");
            } catch (err) {
                setStatus("error");
                setMessage(err.message || "");
            }
        };

        verifyEmail();
    }, [userId, token]);

    const isLoading = status === "loading";
    const isSuccess = status === "success";
    const isError = status === "error";

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

                    <div className="flex justify-center mb-4">
                        {isLoading && (
                            <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                        )}

                        {isSuccess && (
                            <CheckCircle className="h-10 w-10 text-emerald-600" />
                        )}

                        {isError && (
                            <XCircle className="h-10 w-10 text-red-500" />
                        )}
                    </div>

                    <CardTitle className="text-2xl">
                        {isLoading ? "Verificando email" : "Confirmación de email"}
                    </CardTitle>

                    <p className="text-gray-500 mt-2">
                        {isLoading ? "Estamos activando tu cuenta." : message}
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {isError && message && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {message}
                        </div>
                    )}

                    {!isLoading && (
                        <Button
                            asChild
                            className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                            <Link to="/login">Ir al login</Link>
                        </Button>
                    )}

                    {isError && (
                        <p className="text-center text-sm text-gray-500">
                            <Link
                                to="/email-confirmation-sent"
                                className="font-medium text-red-500 hover:text-red-600"
                            >
                                Solicitar un nuevo link
                            </Link>
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default ConfirmEmailPage;