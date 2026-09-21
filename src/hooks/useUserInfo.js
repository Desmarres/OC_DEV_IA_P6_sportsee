import { useEffect, useState } from "react";

/**
 * Récupère les informations et les statistiques de l'utilisateur connecté.
 *
 * Le hook effectue une requête vers l'API lorsque la récupération des données
 * est activée. Il stocke le profil et les statistiques de l'utilisateur
 * et gère les états de chargement et d'erreur.
 *
 * Lorsque `enabled` vaut `false`, aucune requête n'est effectuée.
 *
 * @param {boolean} [enabled=true] - Indique si la récupération des données
 * doit être effectuée.
 *
 * @returns {{
 *   profile: Object,
 *   statistics: Object,
 *   loading: boolean,
 *   error: Error|null
 * }} Les informations utilisateur, les statistiques, l'état de chargement
 * et l'erreur éventuelle.
 */
export default function useUserInfo(enabled = true) {

    const [profile, setProfile] = useState({});
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled) return;

        fetch('/api/user-info')
            .then(response => {
                if (!response.ok) {
                    const error = new Error(
                        "Impossible de récupérer les informations sur le profil"
                    );
                    error.status = response.status;
                    throw error;
                }
                return response.json();
            })
            .then(({ profile, statistics }) => {
                setProfile(profile)
                setStatistics(statistics)
            })
            .catch(error => setError(error))
            .finally(() => setLoading(false))
    }, [enabled])


    return { profile, statistics, loading, error }
}