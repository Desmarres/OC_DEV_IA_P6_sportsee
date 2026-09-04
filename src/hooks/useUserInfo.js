import { useEffect, useState } from "react";

/**
 * Récupère les informations et les statistiques de l'utilisateur connecté.
 *
 * Le hook effectue une requête vers l'API au chargement du composant,
 * puis stocke le profil et les statistiques de l'utilisateur.
 * Il gère également l'état de chargement et les éventuelles erreurs
 * rencontrées lors de la récupération des données.
 *
 * @returns {{
 *   profile: Object,
 *   statistics: Object,
 *   loading: boolean,
 *   error: string|null
 * }} Les informations utilisateur, les statistiques, l'état de chargement
 * et le message d'erreur éventuel.
 */
export default function useUserInfo() {

    const [profile, setProfile] = useState({});
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/user-info')
            .then(response => {
                if (!response.ok) throw Error("Impossible de récupérer les informations utilisateur");
                return response.json()
            })
            .then(({ profile, statistics }) => {
                setProfile(profile)
                setStatistics(statistics)
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false))
    }, [])

    return { profile, statistics, loading, error }
}