import { roleCoachIA } from "@/config/coachIA";
import { MAX_LENGTH_ASSISTANT, MAX_LENGTH_PROMPT, NB_HISTORIC_ACTIVITIES } from "@/config/constants";
import { getProfilStatistic, getValidToken } from "@/utils/auth";
import { getLastActivities } from "@/utils/dataActivity";
import { formatInfosProfilLastActivities } from "@/utils/promptIA";
import { validateHistoricMessages, validateMethode, validatePrompt } from "@/utils/validate";

/**
 * Gère les requêtes de conversation avec l'assistant sportif de Sportsee.
 *
 * Le handler vérifie l'authentification de l'utilisateur, valide la méthode HTTP,
 * le prompt et l'historique des messages, puis récupère les informations du profil,
 * les statistiques et les dernières activités afin de fournir un contexte personnalisé
 * à l'assistant IA.
 *
 * Les messages sont ensuite transmis à l'API Mistral avec le rôle système,
 * et les erreurs liées au service, aux limites de requêtes ou au délai d'attente
 * sont gérées avant de retourner la réponse au client.
 *
 * @param {object} req - Requête HTTP contenant le prompt et l'historique des messages.
 * @param {object} res - Réponse HTTP utilisée pour retourner la réponse de l'assistant.
 *
 * @returns {void} Envoie une réponse HTTP contenant la réponse de Mistral
 * ou un message d'erreur adapté au problème rencontré.
 */
export default async function chat(req, res) {


    const token = getValidToken(req);

    if (!token) return res.status(401).json({ error: 'Non authentifié' });

    const { prompt, historicMessages } = req.body;

    const methodeMessagesError =
        validateMethode(req, "POST");

    if (methodeMessagesError) {
        return res.status(405).json({
            error: methodeMessagesError,
        });
    }

    const promptMessageError =
        validatePrompt(prompt);

    if (promptMessageError) {
        return res.status(400).json({
            error: promptMessageError,
        });
    }

    const historicMessagesError =
        validateHistoricMessages(historicMessages);

    if (historicMessagesError) {
        return res.status(400).json({
            error: historicMessagesError,
        });
    }

    const historicMessagesModify = historicMessages.map(message => {

        const maxLength = (message.role === "user") ? MAX_LENGTH_PROMPT : MAX_LENGTH_ASSISTANT
        if (message.content && message.content.length > maxLength) {
            return {
                ...message,
                content: message.content.slice(0, maxLength) + "..."
            };
        }
        return message;
    });

    const profilStatistic = await getProfilStatistic(token);

    const profile = profilStatistic?.profile;
    const statistics = profilStatistic?.statistics;

    const lastActivities = profile?.weeklyGoal
        ? await getLastActivities(token, NB_HISTORIC_ACTIVITIES, profile.weeklyGoal)
        : null;

    const userInfos = formatInfosProfilLastActivities(profile, statistics, lastActivities);

    const roleSystème = [
        {
            "role": "system",
            "content": `${roleCoachIA} \n${userInfos}`
        },
    ]

    const messages = [
        ...historicMessagesModify,
        {
            role: "user",
            content: prompt,
        },
    ];



    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 30000);


    try {
        const responseMistral = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "mistral-small-latest",
                "messages": [
                    ...roleSystème,
                    ...messages
                ],
                "temperature": 0.7
            })
        })

        const data = await responseMistral.json();

        if (!responseMistral.ok) {
            if (responseMistral.status === 429) {
                return res.status(429).json({
                    error: "Trop de requêtes, veuillez réessayer dans quelques instants.",
                });
            }

            if (responseMistral.status === 400) {
                return res.status(400).json({
                    error: "La requête envoyée à Mistral est invalide.",
                });
            }

            return res.status(502).json({
                error: "Erreur du service Mistral.",
            });
        }

        const answer = data.choices?.[0]?.message?.content;

        if (!answer) {
            return res.status(502).json({
                error: "Réponse invalide reçue de Mistral.",
            });
        }

        return res.status(200).json({
            answer,
        });

    } catch (error) {
        if (error.name === "AbortError") {
            return res.status(504).json({
                error: "Mistral met trop de temps à répondre.",
            });
        }

        return res.status(500).json({
            error: "Erreur interne du serveur.",
        });
    } finally {
        clearTimeout(timeout);
    }
}