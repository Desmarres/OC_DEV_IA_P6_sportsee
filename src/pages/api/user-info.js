import { API_URL } from '@/config/constants';
import { getValidToken } from '@/utils/auth';

/**
 * Récupère les informations du profil et les statistiques de l'utilisateur.
 *
 * Le handler vérifie la présence d'un token d'authentification valide,
 * puis transmet la requête au backend avec ce token.
 * Les données retournées par le backend sont ensuite transmises au client.
 *
 * @param {object} request - Requête HTTP contenant le cookie d'authentification.
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 *
 * @returns {void} Transmet au client les informations du profil et les statistiques
 * retournées par le backend, ou une erreur `401` si l'utilisateur n'est pas authentifié.
 */
export default async function userInfoHandler(request, response) {

    const token = getValidToken(request);

    if (!token) return response.status(401).json({ error: 'Non authentifié' });

    const responseBackend = await fetch(`${API_URL}/api/user-info`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await responseBackend.json();
    response.status(responseBackend.status).json(data);
};