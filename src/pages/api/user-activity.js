import { apiUrl } from "@/config/constants";
import { getValidToken } from "@/utils/auth";

/**
 * Test le token d'authentification,
 * vérifie la présence des dates de début et de fin,
 * appelle la route backend `/api/user-activity` avec le token
 * et les dates fournies,
 * Le backend retourne les activités comprises dans la période demandée,
 * triées par date croissante et sans inclure les activités futures.
 *
 * @param {object} request - Requête HTTP contenant le cookie d'authentification
 * et les paramètres `startWeek` et `endWeek`.
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 * @returns {object[]} Tableau des activités de l'utilisateur :
 * [
 *   {
 *     date,
 *     distance,
 *     duration,
 *     heartRate: {
 *       min,
 *       max,
 *       average
 *     },
 *     caloriesBurned
 *   },
 *   ...
 * ]
 */
export default async function userActivity(request, response) {

    const token = getValidToken(request);

    const { startWeek, endWeek } = request.query;
    if (!startWeek || !endWeek) return response.status(400).json({ message: "startWeek and endWeek are required" });

    const responseBackend = await fetch(`${apiUrl}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await responseBackend.json();
    response.status(responseBackend.status).json(data);
};