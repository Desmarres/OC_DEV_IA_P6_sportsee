import { DAYS } from "@/config/constants";
import styles from "./DayContainer.module.css";

/**
 * Affiche les informations d'une session d'entraînement pour un jour donné.
 *
 * Le composant présente le jour de la semaine, l'objectif et la description
 * de la session, ainsi que sa durée ou sa distance selon les données disponibles.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.session - Données de la session d'entraînement.
 * @param {number} props.session.dayNumber - Numéro du jour de la semaine.
 * @param {string} props.session.sessionObjective - Objectif de la session.
 * @param {string} props.session.description - Description de la session.
 * @param {number|null} props.session.duration - Durée de la session en minutes,
 * ou `null` si une distance est définie.
 * @param {number|null} props.session.distance - Distance de la session en kilomètres,
 * ou `null` si une durée est définie.
 *
 * @returns {JSX.Element} Un bloc présentant les informations de la session.
 */
export default function DayContainer({ session }) {
    return (
        <div>
            <div className={styles.dayContainer}>
                <h2 className="body-large">{DAYS[session.dayNumber].long}</h2>
                <div className={styles.dayMain}>
                    <div className={styles.description}>
                        <h3 className="heading-4">{session.sessionObjective}</h3>
                        <p className="body-default">{session.description}</p>
                    </div>
                    <div className={`${styles.timer} body-small`}>
                        {session.duration !== null
                            ? `${session.duration}min`
                            : `${session.distance}km`}
                    </div>
                </div>
            </div>
        </div>
    );
}