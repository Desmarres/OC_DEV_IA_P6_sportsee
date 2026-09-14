import { getValidToken } from "@/utils/auth";

/**
 * Vérifie la présence d'un token d'authentification valide
 * afin de déterminer si l'utilisateur est authentifié.
 *
 * @param {object} request - Requête HTTP contenant le cookie d'authentification.
 * @param {object} response - Réponse HTTP utilisée pour retourner le statut d'authentification.
 *
 * @returns {void} Envoie une réponse HTTP contenant `{ authenticated: boolean }`
 * indiquant si l'utilisateur dispose d'un token valide.
 */
export default function meHandler(request, response) {

    const token = getValidToken(request);
    response.status(200).json({ authenticated: !!token });
};