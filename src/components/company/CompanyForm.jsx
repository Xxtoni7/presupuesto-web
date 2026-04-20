import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createCompany, updateCompany } from "../../api/companyApi";
import { uploadCompanyLogo } from "../../api/uploadApi";
import { API_BASE_URL } from "../../utils/constants";
import { Upload } from "lucide-react";

function CompanyForm({ company, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);
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
        idUser: 1,
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
            idUser: company.idUser ?? 1,
        });

        setLogoPreview(company.logoUrl ? `${API_BASE_URL}${company.logoUrl}` : "");
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

            setLogoPreview(`${API_BASE_URL}${result.url}`);
        } catch (err) {
            alert(err.message || "Error al subir el logo");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        try {
            setLoading(true);

            if (isEdit) {
                const id = company.idCompany ?? company.id;
                await updateCompany(id, formData);
            } else {
                await createCompany(formData);
            }

            onSuccess();
        } catch (err) {
            alert(err.message || "Error al guardar");
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
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#111111]">
                        Nombre de la empresa *
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Construcciones del Sur"
                        required
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-[#d1d5db] bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="logoInput" className="block text-sm font-medium text-[#111111]">
                        Logo de la empresa
                    </label>

                    <div className="mt-1.5 flex flex-col items-start gap-3">
                        {logoPreview && (
                            <div className="relative inline-block">
                                <img
                                src={logoPreview}
                                alt="Preview del logo"
                                className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
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
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d1d5db] bg-white px-4 text-sm font-medium text-[#111111] shadow-sm hover:bg-gray-50"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {logoPreview ? "Cambiar logo" : "Subir logo"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="colorMain" className="block text-sm font-medium text-[#111111]">
                            Color principal
                        </label>
                        <div className="relative mt-1.5">
                            <input
                                id="colorMain"
                                name="colorMain"
                                type="color"
                                value={formData.colorMain || "#000000"}
                                onChange={handleChange}
                                className="absolute inset-0 h-10 w-full cursor-pointer opacity-0"
                            />

                            <button
                                type="button"
                                className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#d1d5db] bg-white px-3 shadow-sm hover:bg-gray-50"
                            >
                                <div
                                className="h-6 w-6 rounded-md border"
                                style={{ backgroundColor: formData.colorMain || "#000000" }}
                                />
                                <span className="text-sm text-[#111111]">Elegir color</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="colorSecondary" className="block text-sm font-medium text-[#111111]">
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
                                className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#d1d5db] bg-white px-3 shadow-sm hover:bg-gray-50"
                            >
                                <div
                                className="h-6 w-6 rounded-md border"
                                style={{ backgroundColor: formData.colorSecondary || "#000000" }}
                                />
                                <span className="text-sm text-[#111111]">Elegir color</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-[#111111]">
                        Rubro / Industria
                    </label>
                    <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-[#d1d5db] bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
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
                        <label htmlFor="phone" className="block text-sm font-medium text-[#111111]">
                            Teléfono
                        </label>
                        <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+54 11 1234-5678"
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-[#d1d5db] bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                        />
                    </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#111111]">
                        Email
                    </label>
                    <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contacto@empresa.com"
                    className="mt-1.5 flex h-9 w-full rounded-lg border border-[#d1d5db] bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                    />
                </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-[#111111]">
                        Dirección
                    </label>
                    <input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Calle, número, ciudad"
                        className="mt-1.5 flex h-9 w-full rounded-lg border border-[#d1d5db] bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 md:text-sm"
                    />
                </div>
            </div>

            <div className="flex gap-3 border-t border-[#e5e7eb] pt-4">
                <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d1d5db] bg-white px-4 text-sm font-medium text-[#111111] shadow-sm hover:bg-gray-50"
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