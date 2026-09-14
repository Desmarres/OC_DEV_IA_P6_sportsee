import { serialize } from 'cookie';

/**
 * Invalide le cookie d'authentification `token` afin de déconnecter l'utilisateur.
 *
 * @param {object} request - Requête HTTP.
 * @param {object} response - Réponse HTTP utilisée pour supprimer le cookie.
 *
 * @returns {void} Envoie une réponse HTTP indiquant que la déconnexion
 * a été effectuée avec succès.
 */
export default function logoutHandler(request, response) {
    response.setHeader('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/'
    }));
    response.status(200).json({ ok: true });
};