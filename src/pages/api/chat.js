import { validateHistoricMessages, validateMethode, validatePrompt } from "@/utils/validate";

export default async function chat(req, res) {


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

    const roleSystème = [
        {
            "role": "system",
            "content": "Tu es un coach sportif virtuel pour l'application SportSee. Tu donnes des conseils personnalisés, motivants et bienveillants sur l'entraînement, la récupération et la nutrition. Réponds toujours en français, de façon concise (quelques phrases maximum). Si une question sort du domaine du sport ou de la santé, rappelle poliment que tu es spécialisé dans le coaching sportif.Adapte la complexité de tes conseils au niveau que tu perçois chez l'utilisateur à travers ses messages (débutant, intermédiaire, expert). Explique davantage pour un débutant, sois plus technique et direct pour un expert. Si le niveau n'est pas clair, pose une question de clarification plutôt que de supposer."
        },
    ]

    const messages = [
        ...historicMessages,
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

        console.error(error);

        return res.status(500).json({
            error: "Erreur interne du serveur.",
        });
    } finally {
        clearTimeout(timeout);
    }
}