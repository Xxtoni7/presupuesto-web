import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createCompany, updateCompany } from "../../api/companyApi";
import { uploadCompanyLogo } from "../../api/uploadApi";
import { Upload } from "lucide-react";

function emptyToNull(value) {
    const trimmedValue = value?.trim();

    return trimmedValue || null;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function CompanyForm({ company, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const fileInputRef = useRef(null);
    const [logoPreview, setLogoPreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        logoUrl: "",
        colorMain: "",
        colorSecondary: "",
        industry: "",
        phone: "",
        email: "",
        address: "",
    });

    const isEdit = Boolean(company);

    useEffect(() => {
        if (!company) {
            setLogoPreview("");
            return;
        }

        setFormData({
            name: company.name || "",
            logoUrl: company.logoUrl || "",
            colorMain: company.colorMain || "",
            colorSecondary: company.colorSecondary || "",
            industry: company.industry || "",
            phone: company.phone || "",
            email: company.email || "",
            address: company.address || "",
        });

        setLogoPreview(company.logoUrl || "");
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);

            const result = await uploadCompanyLogo(file, formData.logoUrl);

            setFormData((prev) => ({
                ...prev,
                logoUrl: result.url,
            }));

            setLogoPreview(URL.createObjectURL(file));
        } catch (err) {
            setError(err.message || "Error al subir el logo");
        } finally {
            setLoading(false);
        }
    };

    const buildCompanyPayload = () => ({
        name: formData.name.trim(),
        logoUrl: emptyToNull(formData.logoUrl),
        colorMain: formData.colorMain || "#c90000",
        colorSecondary: formData.colorSecondary || "#000000",
        industry: emptyToNull(formData.industry),
        phone: emptyToNull(formData.phone),
        email: emptyToNull(formData.email),
        address: emptyToNull(formData.address),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        if (!formData.name.trim()) {
            setError("El nombre de la empresa es obligatorio.");
            return;
        }

        const email = formData.email.trim();

        if (email && !isValidEmail(email)) {
            setFieldErrors((prev) => ({
                ...prev,
                email: "Ingresá un email válido para la empresa.",
            }));
            return;
        }

        try {
            setLoading(true);

            const payload = buildCompanyPayload();

            if (isEdit) {
                const id = company.idCompany ?? company.id;
                await updateCompany(id, payload);
            } else {
                await createCompany(payload);
            }

            onSuccess();
        } catch (err) {
            setError(err.message || "Error al guardar la empresa.");
        } finally {
            setLoading(false);
        }
    };

    let buttonText;
    if (loading) {
        buttonText = "Guardando...";
    } else if (isEdit) {
        buttonText = "Actualizar empresa";
    } else {
        buttonText = "Crear empresa";
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                        Nombre de la empresa{" "}
                        <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Construcciones del Sur"
                        required
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="logoInput" className="block text-sm font-medium text-foreground">
                        Logo de la empresa
                    </label>

                    <div className="mt-1.5 flex flex-col items-start gap-3">
                        {logoPreview && (
                            <div className="relative inline-block">
                                <img
                                src={logoPreview}
                                alt="Preview del logo"
                                className="h-32 w-32 rounded-lg border border-border bg-white object-contain"
                                />

                                <button
                                type="button"
                                onClick={() => {
                                    setLogoPreview("");
                                    setFormData((prev) => ({
                                    ...prev,
                                    logoUrl: "",
                                    }));

                                    if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                    }
                                }}
                                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <input
                        id="logoInput"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        />

                        <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {logoPreview ? "Cambiar logo" : "Subir logo"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="colorMain" className="block text-sm font-medium text-foreground">
                            Color principal
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                id="colorMain"
                                name="colorMain"
                                type="color"
                                value={formData.colorMain || "#c90000"}
                                onChange={handleChange}
                                className="absolute inset-0 h-10 w-full cursor-pointer opacity-0"
                            />

                            <button
                                type="button"
                                className="flex h-10 w-full items-center gap-3 rounded-lg border border-input bg-background px-3 shadow-sm hover:bg-accent"
                            >
                                <div
                                className="h-6 w-6 rounded-md border"
                                style={{ backgroundColor: formData.colorMain || "#c90000" }}
                                />
                                <span className="text-sm text-foreground">Elegir color</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="colorSecondary" className="block text-sm font-medium text-foreground">
                            Color secundario
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                id="colorSecondary"
                                name="colorSecondary"
                                type="color"
                                value={formData.colorSecondary || "#000000"}
                                onChange={handleChange}
                                className="absolute inset-0 h-10 w-full cursor-pointer opacity-0"
                            />

                            <button
                                type="button"
                                className="flex h-10 w-full items-center gap-3 rounded-lg border border-input bg-background px-3 shadow-sm hover:bg-accent"
                            >
                                <div
                                className="h-6 w-6 rounded-md border"
                                style={{ backgroundColor: formData.colorSecondary || "#000000" }}
                                />
                                <span className="text-sm text-foreground">Elegir color</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-foreground">
                        Rubro / Industria{" "}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                            (Opcional)
                        </span>
                    </label>
                    <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                    >
                        <option value="">Seleccionar rubro</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Construcción">Construcción</option>
                        <option value="Refaciones">Refaciones</option>
                        <option value="Salud">Salud</option>
                        <option value="Plomería">Plomería</option>
                        <option value="Inmobiliaria">Inmobiliaria</option>
                        <option value="Gastronomía">Gastronomía</option>
                        <option value="Comercio">Comercio</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Pintura">Pintura</option>
                        <option value="Electricidad">Electricidad</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                            Teléfono empresa{" "}
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                (Opcional)
                            </span>
                        </label>
                        <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+54 11 1234-5678"
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground">
                            Email empresa{" "}
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                (Opcional)
                            </span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contacto@empresa.com"
                            className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                        />
                        {fieldErrors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-foreground">
                        Dirección empresa{" "}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                            (Opcional)
                        </span>
                    </label>
                    <input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Calle, número, ciudad"
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                    />
                </div>
            </div>

            <div className="flex gap-3 border-t border-border pt-4">
                <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
                >
                    Cancelar
                </button>

                <button
                type="submit"
                disabled={loading}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-70"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
}

CompanyForm.propTypes = {
    company: PropTypes.object,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};

export default CompanyForm;
