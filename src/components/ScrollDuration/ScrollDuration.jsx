import styles from "./ScrollDuration.module.css"

/**
 * Affiche l'en-tête d'un graphique avec sa valeur principale,
 * la période affichée et des boutons permettant de naviguer
 * entre les différentes périodes.
 *
 * Un texte descriptif est également affiché sous l'en-tête.
 * La couleur principale du composant est personnalisable via la propriété
 * `color`.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string|number} props.title - Valeur ou titre principal affiché
 * au-dessus du graphique.
 * @param {string} props.color - Couleur utilisée pour personnaliser
 * l'apparence de l'en-tête.
 * @param {string} props.firstDate - Date de début de la période affichée.
 * @param {string} props.lastDate - Date de fin de la période affichée.
 * @param {string} props.description - Description de la donnée présentée
 * par le graphique.
 * @param {Function} props.onClick - Fonction appelée lors de la navigation
 * entre les périodes. Reçoit `true` pour revenir à la période précédente
 * et `false` pour passer à la période suivante.
 *
 * @returns {JSX.Element} Un en-tête de graphique avec sa période,
 * ses contrôles de navigation et sa description.
 */
export default function ScrollDuration({ title, color, firstDate, lastDate, description, onClick }) {
    return (
        <div >
            <div
                className={styles.headerScrollDuration}
                style={{ "--component-color": color }}
            >
                <p className={`${styles.averageChart} heading-4`}>{title}</p>
                <div className={styles.scrollDurationContainer}>
                    <button onClick={() => onClick(true)}>
                        <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.70709 0.5L0.707092 4.5L4.70709 8.5" stroke="#111111" strokeLinecap="round" />
                        </svg>
                    </button>
                    <p className="body-small">{firstDate} - {lastDate}</p>
                    <button onClick={() => onClick(false)}>
                        <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="#111111" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <p className={`${styles.descriptionChart} body-small`}>{description}</p>
        </div>

    )
}