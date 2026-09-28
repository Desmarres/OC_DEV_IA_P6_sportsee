import { useCallback, useRef, useState } from "react";

/**
 * Gère la génération d'un planning d'entraînement personnalisé.
 *
 * Le hook envoie une requête à l'API avec les paramètres fournis,
 * conserve le planning généré et gère les états de chargement et d'erreur.
 * Une requête en cours est annulée lorsqu'une nouvelle génération est lancée.
 *
 * @returns={{
 *   plan: Object|null,
 *   loading: boolean,
 *   error: Error|null,
 *   generatePlan: Function
 * }} Le planning généré, l'état de chargement, l'erreur éventuelle
 * et la fonction permettant de générer un nouveau planning.
 */
export default function useGenerateTrainingPlan() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const abortControllerRef = useRef(null);

    const generatePlan = useCallback(async (request) => {
        abortControllerRef.current?.abort();

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/training-plan/generate", {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            const body = await response.json();

            if (!response.ok) {
                const error = new Error(
                    body.error || "Une erreur est survenue."
                );

                error.status = response.status;

                throw error;
            }

            setPlan(body.answer);

            return body.answer;

        } catch (error) {
            if (error.name === "AbortError") {
                return;
            }

            setError(error);
            setPlan(null);

            throw error;

        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    return {
        plan,
        loading,
        error,
        generatePlan,
    };
}