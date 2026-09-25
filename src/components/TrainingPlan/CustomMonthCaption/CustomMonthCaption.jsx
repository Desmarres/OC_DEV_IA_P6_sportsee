import styles from "./CustomMonthCaption.module.css";

/**
 * Affiche le nom et l'année du mois actuellement affiché dans le calendrier.
 *
 * La date est formatée selon la locale française afin d'afficher
 * le mois en toutes lettres suivi de l'année.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.calendarMonth - Informations sur le mois affiché
 * dans le calendrier.
 * @param {Date} props.calendarMonth.date - Date correspondant au mois affiché.
 *
 * @returns {JSX.Element} Le libellé du mois et de l'année affichés.
 */
export default function CustomMonthCaption({ calendarMonth }) {
    const month = calendarMonth.date;

    return (
        <div className={styles.monthCaption}>
            <span className="body-default">
                {month.toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                })}
            </span>
        </div>
    );
}