import { apiUrl } from '@/config/constants';
import { getValidToken } from '@/utils/auth';

/**
 * Test le token d'authentification,
 * appelle la route backend `/api/user-info` avec ce token,
 * puis retourne les informations utilisateur et ses statistiques au client.
 *
 * @param {object} request - Requête HTTP contenant le cookie d'authentification.
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 * @returns {object} Les informations utilisateur et ses statistiques :
 * {
 *  profile: userProfile{
 *      firstName,
 *      lastName,
 *      createdAt,
 *      age,
 *      weight,
 *      height,
 *      profilePicture
 *  },
 *  statistics: {
 *     totalDistance,
 *     totalSessions,
 *     totalDuration
 *  }
 * }
 */
export default async function userInfoHandler(request, response) {

    const token = getValidToken(request);

    if (!token) return response.status(401).json({ error: 'Non authentifié' });

    const responseBackend = await fetch(`${apiUrl}/api/user-info`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await responseBackend.json();
    response.status(responseBackend.status).json(data);
};