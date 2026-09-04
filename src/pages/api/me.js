import { getValidToken } from "@/utils/auth";

/**
 * Test le token d'authentification et retourne 
 * true s'il y a un token ou 
 * false si il est null
 * @param {object} request - Requête HTTP contenant le cookie d'authentification
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 * @returns {object} {authenticated : boolean} 
 */
export default function meHandler(request, response) {

    const token = getValidToken(request);
    response.status(200).json({ authenticated: !!token });
};