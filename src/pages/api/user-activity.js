import { API_URL } from "@/config/constants";
import { getValidToken } from "@/utils/auth";

/**
 * Récupère les activités de l'utilisateur pour une période donnée.
 *
 * Le handler vérifie le token d'authentification, contrôle la présence
 * des dates de début et de fin, puis transmet la requête au backend
 * avec le token d'authentification.
 *
 * Le backend retourne les activités comprises dans la période demandée,
 * triées par date croissante et sans inclure les activités futures.
 *
 * @param {object} request - Requête HTTP contenant le cookie d'authentification
 * et les paramètres `startWeek` et `endWeek`.
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 *
 * @returns {void} Transmet au client les activités retournées par le backend
 * ainsi que le statut HTTP associé.
 */
export default async function userActivity(request, response) {

    const token = getValidToken(request);

    const { startWeek, endWeek } = request.query;
    if (!startWeek || !endWeek) return response.status(400).json({ message: "startWeek and endWeek are required" });

    const responseBackend = await fetch(`${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await responseBackend.json();
    response.status(responseBackend.status).json(data);
};