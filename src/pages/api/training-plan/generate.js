import { roleTrainingPlan } from "@/config/trainingPlan";
import { getValidToken } from "@/utils/auth";
import { getNumberOfWeeks } from "@/utils/date";
import { formatRequestTrainingPlan } from "@/utils/promptIA";
import { getUserInfos } from "@/utils/userInfos";
import { validateAvailableDays, validateResponseIA, validateResponseMatchesRequest, validateStartEndDate, validateTarget, validateTimeSlot } from "@/utils/validate";
import responseTrainingIA from "@/config/responseTrainingIA.json"
import { NB_HISTORIC_ACTIVITIES } from "@/config/constants";

export default async function generate(req, res) {

    const token = getValidToken(req);

    if (!token) return res.status(401).json({ error: 'Non authentifié' });

    const { target, startDate, endDate, availableDays, timeSlot } = req.body;

    const requestErrorMessage =
        validateTarget(target) ||
        validateStartEndDate(startDate, endDate) ||
        validateAvailableDays(availableDays) ||
        validateTimeSlot(timeSlot);

    if (requestErrorMessage) {
        return res.status(400).json({ error: requestErrorMessage });
    }

    const numberOfWeeks = getNumberOfWeeks(startDate, endDate);

    const requestConstraints = { target, startDate, endDate, availableDays, timeSlot, numberOfWeeks };

    const haveWeeklyGoal = false;

    const userInfos = await getUserInfos(token, NB_HISTORIC_ACTIVITIES, haveWeeklyGoal);

    const roleTrainingPlanMessage = roleTrainingPlan(target)

    const roleSystème = [
        {
            "role": "system",
            "content": `${roleTrainingPlanMessage} \n${userInfos}`
        },
    ]

    const prompt = formatRequestTrainingPlan(target, startDate, endDate, availableDays, timeSlot, numberOfWeeks);

    const message = {
        role: "user",
        content: prompt,
    };

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
                    message
                ],
                "response_format": responseTrainingIA,
                "temperature": 0.3
            })
        })

        const data = await responseMistral.json();
        console.log("data.usage : ", data.usage);

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

        const answer = JSON.parse(data.choices?.[0]?.message?.content);
        console.log("answer : ", answer)

        const responseErrorMessage =
            !answer
                ? "Réponse invalide reçue de Mistral."
                : validateResponseIA(answer) ||
                validateResponseMatchesRequest(requestConstraints, answer);


        if (responseErrorMessage) {
            return res.status(502).json({ error: responseErrorMessage });
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

        if (error instanceof SyntaxError) {
            return res.status(502).json({
                error: "Réponse JSON invalide reçue de Mistral.",
            });
        }

        return res.status(500).json({
            error: "Erreur interne du serveur.",
        });
    } finally {
        clearTimeout(timeout);
    }
}