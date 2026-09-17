import { useEffect, useState } from "react";

export default function useAnswerChat(prompt) {

    const [result, setResult] = useState({
        key: null,
        data: null,
        error: null,
    });

    const requestKey = JSON.stringify(prompt);
    const promptValid = Boolean(prompt);

    useEffect(() => {

        if (!promptValid) return;

        const controller = new AbortController();

        fetch("/api/chat", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    const error = new Error(
                        "Impossible de récupérer la réponse du coach IA"
                    );
                    error.status = response.status;
                    throw error;
                }
                return response.json();
            })
            .then(({ answer }) => {
                setResult({
                    key: requestKey,
                    data: answer,
                    error: null,
                });
            })
            .catch(error => {
                if (error.name === "AbortError") return;
                setResult({
                    key: requestKey,
                    data: null,
                    error: error,
                });
            });
        return () => controller.abort();
    }, [prompt, promptValid, requestKey]);

    const loading =
        promptValid && result.key !== requestKey;

    return { loading, result };
}