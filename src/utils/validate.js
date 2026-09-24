import { LISTE_TRAINING_OBJECTIF, MAX_LENGTH_PROMPT, MAX_MESSAGES } from "@/config/constants";
import { isValidISODate, isValidTimeSlot } from "./date";

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

/**
 * Valide la structure et le contenu d'une réponse générée par l'assistant IA.
 *
 * La fonction vérifie successivement le format général de la réponse,
 * les objectifs, les dates, les paramètres du planning, les semaines
 * et les sessions d'entraînement. Elle retourne un message d'erreur
 * dès qu'une donnée ne respecte pas les règles attendues.
 *
 * @param {Object} response - Réponse de l'assistant IA à valider.
 *
 * @returns {string|null} Un message décrivant la première erreur détectée,
 * ou `null` si la réponse est conforme.
 */
export const validateResponseIA = (response) => {

    if (
        typeof response !== "object" ||
        response === null ||
        Array.isArray(response)
    ) {
        return "Le format de la réponse n'est pas conforme.";
    }

    if (!LISTE_TRAINING_OBJECTIF.includes(response.target)) {
        return "L'objectif retourné n'est pas valide.";
    }

    if (
        response.adjustmentNote !== null &&
        typeof response.adjustmentNote !== "string"
    ) {
        return "La note de régularisation n'est pas valide.";
    }

    if (!Array.isArray(response.weeks)) {
        return "Le liste des semaines n'est pas valide.";
    }

    for (let i = 0; i < response.weeks.length; i++) {
        const week = response.weeks[i];

        if (
            typeof week !== "object" ||
            week === null ||
            Array.isArray(week)
        ) {
            return `La semaine ${i + 1} n'est pas conforme.`;
        }

        if (!Number.isInteger(week.weekNumber) || (week.weekNumber !== i + 1)) {
            return `La semaine ${i + 1} n'est pas valide.`;
        }

        if (!Array.isArray(week.sessions)) {
            return `La liste des sessions de la semaine ${i + 1} n'est pas valide.`;
        }

        for (let j = 0; j < week.sessions.length; j++) {
            const session = week.sessions[j];

            if (
                typeof session !== "object" ||
                session === null ||
                Array.isArray(session)
            ) {
                return `La session ${j + 1} de la semaine ${i + 1} n'est pas conforme.`;
            }

            if (!Number.isInteger(session.dayNumber) || session.dayNumber < 0 || session.dayNumber > 6) {
                return `Le numéro du jour de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (typeof session.type !== "string" || !session.type.trim()) {
                return `Le type de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (typeof session.sessionObjective !== "string" || !session.sessionObjective.trim()) {
                return `L'objectif de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (session.duration !== null &&
                (!Number.isInteger(session.duration) ||
                    session.duration < 0)) {
                return `La durée de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (session.distance !== null &&
                (typeof session.distance !== "number" ||
                    !Number.isFinite(session.distance) ||
                    session.distance < 0
                )
            ) {
                return `La distance de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (typeof session.intensity !== "string" || !session.intensity.trim()) {
                return `L'intensité de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (typeof session.description !== "string" || !session.description.trim()) {
                return `La description de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }

            if (
                session.advice !== null &&
                typeof session.advice !== "string"
            ) {
                return `Le conseil de la session ${j + 1} de la semaine ${i + 1} n'est pas valide.`;
            }
        }
    }

    return null;
};

/**
 * Vérifie que le planning généré par l'assistant IA respecte les contraintes
 * définies dans la demande initiale.
 *
 * La fonction contrôle notamment la conservation de l'objectif, le nombre
 * de semaines, les jours disponibles et la présence d'une durée ou d'une
 * distance, mais pas des deux, pour chaque session.
 *
 * @param {Object} request - Contraintes et paramètres de la demande initiale.
 * @param {Object} response - Planning généré par l'assistant IA.
 *
 * @returns {string|null} Un message décrivant la première incohérence
 * détectée, ou `null` si la réponse est conforme.
 */
export const validateResponseMatchesRequest = (request, response) => {

    if (response.target !== request.target && response.adjustmentNote === null) {
        return `L'objectif a été changé sans justification`;
    }

    if (response.adjustmentNote !== null && response.target === request.target) {
        return "Une note d'ajustement est présente mais l'objectif n'a pas été mis à jour en conséquence.";
    }

    if (response.weeks.length !== request.numberOfWeeks) {
        return `Le nombre de semaines du planning (${response.weeks.length}) ne respecte pas la demande (${request.numberOfWeeks}).`;
    }

    for (let i = 0; i < response.weeks.length; i++) {

        const week = response.weeks[i];

        for (let j = 0; j < week.sessions.length; j++) {

            const session = week.sessions[j];

            if (!request.availableDays.includes(session.dayNumber)) {
                return "Le programme ne respecte pas les jours diponnibles envoyés";
            }

            const hasDuration = session.duration !== null;
            const hasDistance = session.distance !== null;

            if (hasDuration === hasDistance) {
                return "La session doit avoir soit une durée, soit une distance, mais pas les deux.";
            }
        }
    }
    return null;
};

/**
 * Valide la valeur du champ `target` en vérifiant son type et sa présence
 * parmi les objectifs d'entraînement autorisés.
 *
 * @param {string} target - Objectif d'entraînement à valider.
 *
 * @returns {string|null} Un message d'erreur si la valeur est invalide,
 * ou `null` si elle est valide.
 */
export const validateTarget = (target) => {

    if (typeof target !== "string" || !LISTE_TRAINING_OBJECTIF.includes(target)) {
        return "Le champ 'target' n'est pas valide.";
    }

    return null
}

/**
 * Valide les dates de début et de fin d'une période.
 *
 * Vérifie que les deux dates respectent le format ISO `YYYY-MM-DD`
 * et que la date de début est antérieure à la date de fin.
 *
 * @param {string} startDate - Date de début de la période.
 * @param {string} endDate - Date de fin de la période.
 *
 * @returns {string|null} Un message d'erreur si l'une des dates est invalide
 * ou si l'ordre des dates n'est pas respecté, sinon `null`.
 */
export const validateStartEndDate = (startDate, endDate) => {

    if (!isValidISODate(startDate)) {
        return "Le champ 'startDate' n'est pas valide au format ISO `YYYY-MM-DD`. "
    }

    if (!isValidISODate(endDate)) {
        return "Le champ 'endDate' n'est pas valide au format ISO `YYYY-MM-DD`. "
    }

    if (startDate >= endDate) {
        return "Le champ 'startDate' doit être antérieur au champ 'endDate'.";
    }

    return null
}

/**
 * Valide la liste des jours disponibles pour l'entraînement.
 *
 * Vérifie que la valeur est un tableau non vide contenant uniquement
 * des entiers compris entre 0 et 6, sans jour présent plusieurs fois.
 *
 * @param {number[]} availableDays - Liste des jours disponibles,
 * représentés par des nombres de 0 à 6.
 *
 * @returns {string|null} Un message d'erreur si la liste est invalide,
 * ou `null` si elle respecte les règles attendues.
 */
export const validateAvailableDays = (availableDays) => {

    if (!Array.isArray(availableDays) || availableDays.length === 0) {
        return "Le champ 'availableDays' doit être un tableau non vide.";
    }

    const seenDays = new Set();

    for (const day of availableDays) {
        if (
            typeof day !== "number" ||
            !Number.isInteger(day) ||
            day < 0 ||
            day > 6
        ) {
            return "Le champ 'availableDays' doit contenir uniquement des nombres entiers compris entre 0 et 6.";
        }

        if (seenDays.has(day)) {
            return `Le jour ${day} apparaît plusieurs fois dans 'availableDays'.`;
        }

        seenDays.add(day);
    }

    return null
}

/**
 * Valide le créneau horaire choisi pour l'entraînement.
 *
 * Vérifie que le créneau respecte le format attendu `HHhMM-HHhMM`,
 * avec des minutes facultatives.
 *
 * @param {string} timeSlot - Créneau horaire à valider.
 *
 * @returns {string|null} Un message d'erreur si le créneau est invalide,
 * ou `null` s'il est valide.
 */
export const validateTimeSlot = (timeSlot) => {

    if (!isValidTimeSlot(timeSlot)) {
        return "Le champ 'timeSlot' n'est pas valide. Format attendu : `HHhMM-HHhMM` (minutes facultatives)."
    }

    return null
}
