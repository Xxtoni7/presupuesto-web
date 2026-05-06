import PropTypes from "prop-types";
import { Building2, Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function formatDate(dateValue) {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function normalizeRichTextHtml(html) {
    if (!html) return "";

    return html
        .replaceAll("&nbsp;", " ")
        .replaceAll("\u00A0", " ");
}

function PresupuestoPreview({ presupuesto, company, items }) {
    const primaryColor = company?.colorMain || "#ef4444";
    const secondaryColor = company?.colorSecondary || "#fee2e2";
    const textWrapClass = "whitespace-pre-wrap break-words overflow-wrap-anywhere";
    const API_URL = import.meta.env.VITE_API_URL;

    const logoSrc = company?.logoUrl
        ? `${API_URL}${company.logoUrl}`
        : null;

    const normalizedJobDescription = normalizeRichTextHtml(
        presupuesto.jobDescription
    );

    const isLightColor = (hex) => {
        if (!hex) return false;
        const color = hex.replace("#", "");
        if (color.length !== 6) return false;

        const r = Number.parseInt(color.substring(0, 2), 16);
        const g = Number.parseInt(color.substring(2, 4), 16);
        const b = Number.parseInt(color.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 155;
    };
    const headerTextColor = isLightColor(secondaryColor)
        ? "#111827"
        : "#ffffff";

    return (
        <div className="mx-auto w-full max-w-4xl min-w-0 overflow-x-hidden bg-white p-8 text-black">
            <div
                className="border-b-2 pb-6"
                style={{ borderColor: primaryColor }}
            >
                <div className="flex items-start justify-between gap-6">
                    <div className="flex items-center gap-5">
                        {company?.logoUrl ? (
                            <img
                                src={logoSrc}
                                alt={company.name}
                                className="h-20 w-24 rounded-lg border border-gray-200 object-contain p-1"
                            />
                        ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100">
                                <Building2 className="h-8 w-8 text-gray-400" />
                            </div>
                        )}

                        <div className="pt-1">
                            <h1 className="text-lg font-semibold text-gray-900">
                                {company?.name}
                            </h1>

                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                {company?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        <span>{company.phone}</span>
                                    </div>
                                )}

                                {company?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" />
                                        <span>{company.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2
                            className="text-3xl font-bold"
                            style={{ color: primaryColor }}
                        >
                            PRESUPUESTO
                        </h2>

                        <p className="mt-1 text-lg font-semibold text-gray-900">
                            {presupuesto.budgetNumber}
                        </p>

                        <div className="mt-2 flex items-center justify-end gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(presupuesto.fechaPresupuesto)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-900">Cliente</h3>
                        <div className="flex items-start gap-2">
                            <User className="mt-0.5 h-4 w-4 text-gray-400" />
                            <p className="text-gray-700">{presupuesto.clientName}</p>
                        </div>
                    </div>

                    {presupuesto.workAddress && (
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-900">
                                Dirección de la obra
                            </h3>
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                <p className="text-gray-700">{presupuesto.workAddress}</p>
                            </div>
                        </div>
                    )}
                </div>

                {presupuesto.jobDescription && (
                    <div>
                        <h3 className="mb-2 font-semibold text-gray-900">
                            Descripción del trabajo:
                        </h3>
                        <div
                            className="
                                rich-text-preview
                                text-gray-700

                                [&_p]:my-2
                                [&_p]:leading-6

                                [&_ul]:my-2
                                [&_ul]:list-disc
                                [&_ul]:pl-5

                                [&_ol]:my-2
                                [&_ol]:list-decimal
                                [&_ol]:pl-5

                                [&_li]:my-1
                                [&_li]:leading-6
                                [&_li]:pl-1

                                [&_strong]:font-bold
                                [&_strong]:text-[#111111]

                                [&_u]:underline
                            "
                            dangerouslySetInnerHTML={{
                                __html: normalizedJobDescription,
                            }}
                        />
                    </div>
                )}

                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">
                        Detalle del presupuesto
                    </h3>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead
                                className="border-b border-gray-200"
                                style={{ backgroundColor: secondaryColor }}
                            >
                                <tr>
                                    <th
                                        className="w-[40%] px-4 py-3 text-left text-sm font-semibold"
                                        style={{ color: headerTextColor }}
                                    >
                                        Descripción
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right text-sm font-semibold"
                                        style={{ color: headerTextColor }}
                                    >
                                        Materiales
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right text-sm font-semibold"
                                        style={{ color: headerTextColor }}
                                    >
                                        Mano de obra
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right text-sm font-semibold"
                                        style={{ color: headerTextColor }}
                                    >
                                        Cantidad
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right text-sm font-semibold"
                                        style={{ color: headerTextColor }}
                                    >
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.idItem}>
                                        <td className="w-[40%] px-4 py-3 text-sm text-gray-700">
                                            <p className="font-medium break-words">{item.description}</p>
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm text-gray-700">
                                            {formatCurrency(item.materials || 0)}
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm text-gray-700">
                                            {formatCurrency(item.labor || 0)}
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm text-gray-700">
                                            {item.quantity}
                                        </td>

                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                            {formatCurrency(item.subtotal || 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot
                                className="border-t border-gray-200"
                                style={{ backgroundColor: secondaryColor }}
                            >
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-4 py-4 text-right text-lg font-bold"
                                        style={{ color: headerTextColor }}
                                    >
                                        TOTAL
                                    </td>
                                    <td
                                        className="px-4 py-4 text-right text-2xl font-bold"
                                        style={{ color: primaryColor }}
                                    >
                                        {formatCurrency(presupuesto.total || 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {(presupuesto.estimatedTime || presupuesto.paymentTerms) && (
                    <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
                        {presupuesto.estimatedTime && (
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">
                                    Tiempo estimado:
                                </h3>
                                <p className={`${textWrapClass} text-gray-700`}>
                                    {presupuesto.estimatedTime}
                                </p>
                            </div>
                        )}

                        {presupuesto.paymentTerms && (
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">
                                    Condiciones de pago:
                                </h3>
                                <p className={`${textWrapClass} text-gray-700`}>
                                    {presupuesto.paymentTerms}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {presupuesto.observations && (
                    <div className="pt-4">
                        <h3 className="mb-2 font-semibold text-gray-900">
                            Observaciones:
                        </h3>
                        <p className={`${textWrapClass} text-gray-700`}>
                            {presupuesto.observations}
                        </p>
                    </div>
                )}

                {presupuesto.fechaVencimiento && (
                    <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                        <p>
                            Presupuesto válido hasta:{" "}
                            <span className="font-medium text-gray-700">
                                {formatDate(presupuesto.fechaVencimiento)}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

PresupuestoPreview.propTypes = {
    presupuesto: PropTypes.shape({
        budgetNumber: PropTypes.string,
        clientName: PropTypes.string,
        fechaPresupuesto: PropTypes.string,
        fechaVencimiento: PropTypes.string,
        workAddress: PropTypes.string,
        jobDescription: PropTypes.string,
        estimatedTime: PropTypes.string,
        paymentTerms: PropTypes.string,
        observations: PropTypes.string,
        total: PropTypes.number,
    }).isRequired,
    company: PropTypes.shape({
        name: PropTypes.string,
        logoUrl: PropTypes.string,
        colorMain: PropTypes.string,
        colorSecondary: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            idItem: PropTypes.number,
            description: PropTypes.string,
            materials: PropTypes.number,
            labor: PropTypes.number,
            quantity: PropTypes.number,
            subtotal: PropTypes.number,
        })
    ).isRequired,
};

export default PresupuestoPreview;