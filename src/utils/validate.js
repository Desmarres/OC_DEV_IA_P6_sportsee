import { MAX_LENGTH_PROMPT, MAX_MESSAGES } from "@/config/constants";

/**
 * Vérifie que la méthode HTTP utilisée pour une requête correspond
 * à la méthode attendue.
 *
 * @param {Object} req - Requête HTTP.
 * @param {string} methode - Méthode HTTP attendue.
 *
 * @returns {string|null} Un message d'erreur si la méthode n'est pas autorisée,
 * sinon `null`.
 */
export const validateMethode = (req, methode) => {

    if (req.method !== methode) {
        return "Méthode non autorisée. Utilisez POST."
    };

    return null;
}

/**
 * Vérifie que le prompt fourni est une chaîne non vide
 * et qu'il respecte la longueur maximale autorisée.
 *
 * @param {string} prompt - Prompt à valider.
 *
 * @returns {string|null} Un message d'erreur si le prompt est invalide,
 * sinon `null`.
 */
export const validatePrompt = (prompt) => {

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return "Le champ 'prompt' est requis et doit être une chaîne non vide."
    }

    if (prompt.length > MAX_LENGTH_PROMPT) {
        return `Le champ 'prompt' ne doit pas dépasser ${MAX_LENGTH_PROMPT} caractères.`
    }

    return null;
}

/**
 * Valide l'historique des messages d'une conversation avec l'assistant IA.
 *
 * Vérifie que l'historique est un tableau, qu'il respecte le nombre maximal
 * d'échanges et qu'il contient une alternance valide entre les messages
 * de l'utilisateur et de l'assistant. Chaque message est également contrôlé
 * afin de vérifier son format et la longueur de son contenu.
 *
 * @param {Array<Object>} historicMessages - Historique des messages à valider.
 *
 * @returns {string|null} Un message d'erreur décrivant la première validation
 * échouée, sinon `null`.
 */
export const validateHistoricMessages = (historicMessages) => {
    if (!Array.isArray(historicMessages)) {
        return "Le champ 'historicMessages' doit être un tableau.";
    }

    if (historicMessages.length > MAX_MESSAGES * 2) {
        return `L'historique ne doit pas contenir plus de ${MAX_MESSAGES} échanges.`;
    }

    if (historicMessages.length % 2 !== 0) {
        return "L'historique doit contenir une alternance complète entre les messages 'user' et 'assistant'.";
    }

    for (let i = 0; i < historicMessages.length; i++) {
        const message = historicMessages[i];

        if (
            typeof message !== "object" ||
            message === null ||
            Array.isArray(message)
        ) {
            return `Le message ${i + 1} doit être un objet.`;
        }

        if (typeof message.role !== "string") {
            return `Le champ 'role' du message ${i + 1} doit être une chaîne.`;
        }

        if (typeof message.content !== "string") {
            return `Le champ 'content' du message ${i + 1} doit être une chaîne.`;
        }

        if (!message.content.trim()) {
            return `Le champ 'content' du message ${i + 1} ne peut pas être vide.`;
        }

        const expectedRole = i % 2 === 0
            ? "user"
            : "assistant";

        if (message.role !== expectedRole) {
            return `Le message ${i + 1} doit avoir le rôle '${expectedRole}'.`;
        }
    }

    return null;
};