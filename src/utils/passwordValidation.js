export const PASSWORD_REQUIREMENTS_MESSAGE =
    "La contraseña debe tener al menos 8 caracteres, una letra minúscula y un número.";

export function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;

    return passwordRegex.test(password);
}