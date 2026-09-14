import styles from "./StatisticalComponent.module.css"

/**
 * Affiche une statistique sous la forme d'un titre, d'une valeur
 * et de son unité.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.title - Titre ou libellé de la statistique.
 * @param {string|number} props.span - Valeur principale de la statistique.
 * @param {string} props.unite - Unité associée à la valeur.
 *
 * @returns {JSX.Element} Un bloc affichant une statistique
 * avec son titre, sa valeur et son unité.
 */
export default function StatisticalComponent({ title, span, unite }) {
    return (
        <div className={styles.statisticalContainer}>
            <h3 className="body-default">{title}</h3>
            <p className="body-large"><span className="heading-4">{span}</span> {unite}</p>
        </div>
    )

}