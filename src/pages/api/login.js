import { API_URL } from "@/config/constants";
import { serialize } from "cookie";

/**
 * Authentifie l'utilisateur auprès du backend et établit sa session.
 *
 * Le handler transmet les identifiants au backend, récupère le token
 * d'authentification et l'identifiant utilisateur, puis stocke le token
 * dans un cookie HttpOnly afin qu'il ne soit pas accessible côté client.
 * Seul l'identifiant utilisateur est renvoyé au client.
 *
 * @param {object} request - Requête HTTP contenant les identifiants de connexion.
 * @param {object} request.body - Corps de la requête.
 * @param {string} request.body.username - Nom d'utilisateur.
 * @param {string} request.body.password - Mot de passe.
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 *
 * @returns {void} Envoie une réponse HTTP contenant `{ userId }` en cas de succès,
 * un message d'erreur en cas d'identifiants invalides ou une erreur serveur.
 */
export default async function loginHandler(request, response) {
    const { username, password } = request.body;

    try {
        const responseBackend = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!responseBackend.ok) {
            return response
                .status(responseBackend.status)
                .json({ error: 'Identifiants invalides' });
        }

        const { token, userId } = await responseBackend.json();

        response.setHeader(
            'Set-Cookie',
            serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
                path: '/'
            })
        );

        return response.status(200).json({ userId });

    } catch (error) {
        console.error('Erreur lors de la connexion :', error);

        return response
            .status(500)
            .json({ message: 'Le serveur est momentanément indisponible' });
    }
};