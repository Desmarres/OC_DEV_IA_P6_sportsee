import { useState } from "react";
import styles from "./WeekContainer.module.css";
import LessIcon from "@/assets/lessIcon.svg"
import MoreIcon from "@/assets/moreIcon.svg"
import DayContainer from "../DayContainer/DayContainer";

/**
 * Affiche une semaine du planning d'entraînement et permet de déplier
 * ou de replier la liste de ses sessions.
 *
 * La première semaine peut être ouverte par défaut grâce à la propriété
 * `isFirst`.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.week - Données de la semaine à afficher.
 * @param {number} props.week.weekNumber - Numéro de la semaine.
 * @param {Array<Object>} props.week.sessions - Liste des sessions
 * d'entraînement de la semaine.
 * @param {boolean} [props.isFirst=false] - Indique si la semaine doit
 * être ouverte par défaut.
 *
 * @returns {JSX.Element} Un bloc représentant la semaine et ses sessions.
 */
export default function WeekContainer({ week, isFirst = false }) {

    const [isOpen, setIsOpen] = useState(isFirst)

    function onChange() {
        setIsOpen(isOpen => !isOpen);
    }

    return (
        <div className={styles.weekContainer}>
            <div className={styles.header}>
                <h2>Semaine {week.weekNumber}</h2>
                <button onClick={() => onChange()}>
                    {
                        isOpen ?
                            <MoreIcon
                                width={13}
                                height={13}
                            /> :
                            <LessIcon
                                width={13}
                                height={13}
                            />
                    }
                </button>
            </div>
            {
                isOpen && <div className={styles.weekMain}>
                    {
                        week.sessions.map((session, index) => (
                            <DayContainer
                                key={index}
                                session={session}
                            />
                        ))
                    }
                </div>
            }
        </div>
    );
}