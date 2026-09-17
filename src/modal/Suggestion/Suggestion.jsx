import styles from "./Suggestion.module.css";

export default function Suggestion({ onClick, loading }) {

    const suggestions = [
        "Comment améliorer mon endurance ?",
        "Que signifie mon score de récupération ?",
        "Peux-tu m’expliquer mon dernier graphique ?"
    ]

    return (
        <div className={`${styles.suggestionContainer} body-small`}>
            {suggestions.map((suggestion, index) => (
                <div
                    className={styles.suggestion}
                    key={`${suggestion}-${index}`}
                    onClick={!loading ? () => onClick(suggestion) : undefined}
                >
                    {suggestion}
                </div>
            ))}
        </div>
    );
}