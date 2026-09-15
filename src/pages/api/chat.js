
export default async function chat(req, res) {

    const MAX_LENGTH = 1000;

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée. Utilisez POST."
        });
    }

    const { prompt } = req.body;

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({
            error: "Le champ 'prompt' est requis et doit être une chaîne non vide."
        });
    }

    if (prompt.length > MAX_LENGTH) {
        return res.status(400).json({
            error: `Le champ 'prompt' ne doit pas dépasser ${MAX_LENGTH} caractères.`
        });
    }

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
                    {
                        "role": "system",
                        "content": "Tu es un coach sportif virtuel pour l'application SportSee. Tu donnes des conseils personnalisés, motivants et bienveillants sur l'entraînement, la récupération et la nutrition. Réponds toujours en français, de façon concise (quelques phrases maximum). Si une question sort du domaine du sport ou de la santé, rappelle poliment que tu es spécialisé dans le coaching sportif."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
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