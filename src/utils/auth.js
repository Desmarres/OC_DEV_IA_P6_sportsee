import { parse } from "cookie";
import jwt from "jsonwebtoken";

/**
 * Récupère le token d'authentification depuis le cookie HttpOnly
 * et vérifie qu'il existe et qu'il n'est pas expiré.
 *
 * @param {object} request - Requête HTTP contenant le cookie d'authentification.
 *
 * @returns {string|null} Le token d'authentification s'il est présent et valide,
 * sinon `null`.
 */
export function getValidToken(request) {

    const cookies = parse(request.headers.cookie || '');
    const token = cookies.token;
    if (!token) return null;

    const decoded = jwt.decode(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) return null;

    return token;
};