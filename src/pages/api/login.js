import { apiUrl } from "@/config/constants";
import { serialize } from "cookie";

/** 
 * Authentifie l'utilisateur auprès du backend,
 * récupère le token d'authentification et l'identifiant utilisateur,
 * stocke le token dans un cookie HttpOnly,
 * puis renvoie uniquement l'identifiant utilisateur au client.
 * @param {object} request - Requête HTTP contenant les identifiants de connexion.
 * @param {object} request.body - Corps de la requête.
 * @param {string} request.body.username - Nom d'utilisateur.
 * @param {string} request.body.password - Mot de passe.
 * @param {object} response - Réponse HTTP utilisée pour retourner les données au client.
 * @returns {void} Envoie une réponse HTTP contenant `{ userId }` ou un message d'erreur.
 */
export default async function loginHandler(request, response) {

    const { username, password } = request.body;

    const responseBackend = await fetch(`${apiUrl}/api/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        }
    );

    if (!responseBackend.ok) {
        return response.status(401).json({ error: 'Identifiants invalides' })
    };

    const { token, userId } = await responseBackend.json();

    response.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24h
        path: '/'
    }));

    return response.status(200).json({ userId });
};