import styles from "./CustomNav.module.css";
import LeftArrow from "@/assets/leftArrow.svg";
import RightArrow from "@/assets/rightArrow.svg";

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