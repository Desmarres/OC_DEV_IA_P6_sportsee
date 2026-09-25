import styles from "./CustomNav.module.css";
import LeftArrow from "@/assets/leftArrow.svg";
import RightArrow from "@/assets/rightArrow.svg";

/**
 * Affiche les boutons de navigation permettant de changer de mois
 * dans le calendrier.
 *
 * Les boutons précédent et suivant sont automatiquement désactivés
 * lorsqu'aucun mois correspondant n'est disponible.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.onPreviousClick - Fonction appelée pour afficher
 * le mois précédent.
 * @param {Function} props.onNextClick - Fonction appelée pour afficher
 * le mois suivant.
 * @param {Date|null} props.previousMonth - Mois précédent disponible,
 * ou `null` s'il n'est pas disponible.
 * @param {Date|null} props.nextMonth - Mois suivant disponible,
 * ou `null` s'il n'est pas disponible.
 *
 * @returns {JSX.Element} Les boutons de navigation du calendrier.
 */
export default function CustomNav({
    onPreviousClick,
    onNextClick,
    previousMonth,
    nextMonth,
}) {
    return (
        <div className={styles.nav}>
            <button
                type="button"
                className={styles.navButton}
                onClick={onPreviousClick}
                disabled={!previousMonth}
                aria-label="Mois précédent"
            >
                <LeftArrow width={6} height={9} />
            </button>

            <button
                type="button"
                className={styles.navButton}
                onClick={onNextClick}
                disabled={!nextMonth}
                aria-label="Mois suivant"
            >
                <RightArrow width={6} height={9} />
            </button>
        </div>
    );
}