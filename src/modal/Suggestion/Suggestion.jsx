import styles from "./Suggestion.module.css";

/**
 * Affiche une liste de suggestions de questions pouvant être posées
 * à l'assistant IA.
 *
 * Chaque suggestion peut être sélectionnée pour déclencher la fonction
 * fournie par le composant parent. Les suggestions sont désactivées
 * lorsque le traitement d'une requête est en cours.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.onClick - Fonction appelée avec la suggestion
 * sélectionnée.
 * @param {boolean} props.loading - Indique si une requête est actuellement
 * en cours de traitement.
 *
 * @returns {JSX.Element} Une liste de boutons contenant les suggestions
 * de questions.
 */
export default function Suggestion({ onClick, loading }) {

    const suggestions = [
        "Comment améliorer mes performances ?",
        "Que dois-je travailler en priorité ?",
        "Comment éviter les blessures ?"
    ]

    return (
        <div className={`${styles.suggestionContainer} body-small`}>
            {suggestions.map((suggestion, index) => (
                <button
                    className={styles.suggestion}
                    key={`${suggestion}-${index}`}
                    onClick={!loading ? () => onClick(suggestion) : undefined}
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
}