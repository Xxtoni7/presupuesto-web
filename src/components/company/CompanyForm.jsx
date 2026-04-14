import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createCompany, updateCompany } from "../../api/companyApi";

function CompanyForm({ company, onSuccess, onCancel }) {
    const [loading, setLoading] = useState(false);

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
        if (!company) return;

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
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                    />
                </div>

                <div>
                    <label htmlFor="logoUrl" className="block text-sm font-medium text-[#111111]">
                        Logo URL
                    </label>
                    <input
                        id="logoUrl"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="colorMain" className="block text-sm font-medium text-[#111111]">
                            Color principal
                        </label>
                        <input
                        id="colorMain"
                        name="colorMain"
                        value={formData.colorMain}
                        onChange={handleChange}
                        placeholder="#FF0000"
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                        />
                    </div>

                    <div>
                        <label htmlFor="colorSecondary" className="block text-sm font-medium text-[#111111]">
                            Color secundario
                        </label>
                        <input
                        id="colorSecondary"
                        name="colorSecondary"
                        value={formData.colorSecondary}
                        onChange={handleChange}
                        placeholder="#000000"
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                        />
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
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                    >
                        <option value="">Seleccionar rubro</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Construcción">Construcción</option>
                        <option value="Regefaciones">Regefaciones</option>
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
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
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
                    className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
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
                        className="mt-1.5 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10"
                    />
                </div>
            </div>

            <div className="flex gap-3 border-t border-[#e5e7eb] pt-4">
                <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-9 items-center justify-center rounded-md border border-[#d1d5db] bg-white px-4 text-sm font-medium text-[#111111] shadow-sm hover:bg-gray-50"
                >
                    Cancelar
                </button>

                <button
                type="submit"
                disabled={loading}
                className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-70"
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