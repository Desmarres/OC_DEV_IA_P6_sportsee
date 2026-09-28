import { getValidToken } from "@/utils/auth";
import { getDuration, getIcsStart, isValidISODate } from "@/utils/date";
import { validateMethode, validateTarget, validateTimeSlot } from "@/utils/validate";
import { createEvents } from "ics";

/**
 * Génère et télécharge un fichier calendrier ICS contenant les séances
 * d'entraînement du planning personnalisé.
 *
 * Le handler vérifie l'authentification et valide les paramètres reçus,
 * puis transforme chaque session du planning en événement calendrier
 * avec sa date, sa durée, sa description et un rappel 30 minutes avant
 * le début de la séance.
 *
 * @param {object} req - Requête HTTP contenant les paramètres du planning.
 * @param {object} req.body - Corps de la requête.
 * @param {string} req.body.target - Objectif principal du planning.
 * @param {string} req.body.startDate - Date de début du planning au format `YYYY-MM-DD`.
 * @param {string} req.body.timeSlot - Créneau horaire des séances.
 * @param {Array<Object>} req.body.weeks - Liste des semaines et de leurs sessions.
 * @param {object} res - Réponse HTTP utilisée pour retourner le fichier ICS.
 *
 * @returns {void} Envoie le fichier ICS généré ou un message d'erreur
 * en cas de requête invalide ou de données mal formées.
 */
export default function downloadIcs(req, res) {

    const token = getValidToken(req);

    if (!token) return res.status(401).json({ error: 'Non authentifié' });

    const { target, startDate, timeSlot, weeks } = req.body;

    const requestErrorMessage =
        validateMethode(req, "POST") ||
        validateTarget(target) ||
        validateTimeSlot(timeSlot) ||
        (!isValidISODate(startDate)
            ? "Le champ 'startDate' n'est pas valide au format ISO `YYYY-MM-DD`."
            : null) ||
        (!Array.isArray(weeks)
            ? "La liste des semaines n'est pas un tableau."
            : null)

    if (requestErrorMessage) {
        return res.status(400).json({ error: requestErrorMessage });
    }

    const events = [];

    try {
        weeks.forEach(week => {
            const weekNumber = week.weekNumber;
            week.sessions.forEach(session => {
                const dayNumber = session.dayNumber;
                const event = {
                    title: `Entraînement ${target} - ${session.type}`,
                    start: getIcsStart(startDate, weekNumber, dayNumber, timeSlot),
                    startOutputType: "local",
                    duration: session.duration ? { minutes: session.duration } : getDuration(timeSlot),
                    description: [
                        "Objectif :",
                        session.sessionObjective,
                        "Intensité :",
                        session.intensity,
                        "Description :",
                        session.description,
                        "Conseil :",
                        session.advice].join("\n"),
                    alarms: [{
                        action: "display",
                        trigger: { minutes: 30, before: true },
                        description: "Rappel : séance d'entraînement dans 30 minutes",
                    }],
                }
                events.push(event);
            });
        });
    } catch (error) {
        return res.status(400).json({ error: "Les données du plan sont mal formées." });
    }

    const { error, value } = createEvents(events)

    if (error) {
        return res.status(400).json({ error: "La requête envoyée est invalide." });
    }

    const filename = `training-plan-${new Date().toISOString().slice(0, 10)}.ics`;
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.status(200).send(value);
}
