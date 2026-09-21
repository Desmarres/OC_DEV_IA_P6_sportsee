import { API_URL } from "@/config/constants";
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

/**
 * Récupère les informations du profil et les statistiques de l'utilisateur
 * depuis le backend.
 *
 * La requête est authentifiée à l'aide du token fourni. En cas d'erreur
 * HTTP ou d'échec de la requête, la fonction retourne `null`.
 *
 * @param {string} token - Token d'authentification utilisé pour la requête.
 *
 * @returns {Promise<{
 *   profile: Object,
 *   statistics: Object
 * }|null>} Les informations du profil et les statistiques de l'utilisateur,
 * ou `null` en cas d'erreur.
 */
export async function getProfilStatistic(token) {

    try {
        const response = await fetch(`${API_URL}/api/user-info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error(
                "Impossible de récupérer les informations de l'utilisateur :",
                response.status
            );
            return null;
        }

        const data = await response.json();

        return {
            profile: data.profile,
            statistics: data.statistics
        };

    } catch (error) {
        console.error(
            "Erreur lors de la récupération des informations utilisateur :",
            error
        );

        return null;
    }
}