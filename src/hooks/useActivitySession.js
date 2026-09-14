import { useEffect, useState } from "react";

/**
 * Récupère les données d'activité de l'utilisateur pour une période donnée.
 *
 * Le hook effectue une requête vers l'API lorsque les dates de début et de fin
 * sont renseignées. Il gère l'état de chargement, les éventuelles erreurs
 * et annule la requête en cours lorsque les paramètres changent ou que
 * le composant est démonté.
 *
 * @param {string} startWeek - Date de début de la période à récupérer.
 * @param {string} endWeek - Date de fin de la période à récupérer.
 *
 * @returns {{
 *   data: Array,
 *   loading: boolean,
 *   error: Error|null
 * }} Les données d'activité, l'état de chargement et l'erreur éventuelle.
 */
export default function useUserActivity(startWeek, endWeek) {

    const [result, setResult] = useState({
        key: null,
        data: [],
        error: null,
    });

    const requestKey = JSON.stringify([startWeek, endWeek]);
    const hasValidDates = Boolean(startWeek && endWeek);

    useEffect(() => {
        if (!hasValidDates) return;

        const controller = new AbortController();

        fetch(`/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`, {
            signal: controller.signal,
        })
            .then(response => {
                if (!response.ok) {
                    const error = new Error(
                        "Impossible de récupérer les informations sur l'activité"
                    );
                    error.status = response.status;
                    throw error;
                }
                return response.json();
            })
            .then(data => {
                setResult({
                    key: requestKey,
                    data,
                    error: null,
                });
            })
            .catch(error => {
                if (error.name === "AbortError") return;
                console.log(error)
                setResult({
                    key: requestKey,
                    data: [],
                    error: error,
                });
            });
        return () => controller.abort();
    }, [startWeek, endWeek, hasValidDates, requestKey]);

    const loading =
        hasValidDates && result.key !== requestKey;

    return {
        data: result.data,
        loading,
        error: result.key === requestKey ? result.error : null,
    };
}