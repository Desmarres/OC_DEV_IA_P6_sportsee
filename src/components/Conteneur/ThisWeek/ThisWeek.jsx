import ActivityTargetBarChart from "@/components/BarChart/ActivityTargetBarChart/ActivityTargetBarChart"
import styles from "./ThisWeek.module.css"
import { formatDateWeek } from "@/utils/date";
import useUserActivity from "@/hooks/useActivitySession";
import Loader from "@/components/Loader/Loader";
import { GOAL_TARGET } from "@/config/constants";
import { getAggregateActivityMetrics } from "@/utils/dataActivity";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

/**
 * Affiche un résumé des activités réalisées par l'utilisateur
 * au cours de la semaine en cours.
 *
 * Le composant présente la période concernée, le nombre de courses
 * réalisées par rapport à l'objectif hebdomadaire, ainsi que la durée
 * totale d'activité et la distance parcourue.
 *
 * Les données sont récupérées pour la semaine correspondant à la date
 * fournie et les états de chargement et d'erreur sont pris en charge.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Date} [props.today=new Date()] - Date de référence utilisée
 * pour déterminer la semaine affichée.
 * @param {number} [props.goal=GOAL_TARGET] - Objectif hebdomadaire
 * de courses à atteindre.
 *
 * @returns {JSX.Element} Un résumé des performances de la semaine,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function ThisWeek({ today = new Date(), goal = GOAL_TARGET }) {

    const { startWeek, endWeek } = formatDateWeek(today);
    const { data, loading, error } = useUserActivity(startWeek.formatISO, endWeek.formatISO);

    const { countActivity, activityDuration, activityDistance } = getAggregateActivityMetrics(data)

    return (
        <div className={styles.thisWeek}>
            <div className={styles.headerThisWeek}>
                <h2 className="heading-4">Cette semaine</h2>
                <p className="body-large">Du {startWeek.formatEuropean} au {endWeek.formatEuropean}</p>
            </div>
            {loading ?
                <Loader /> :
                error ?
                    ErrorMessage({ error }) :
                    <div className={styles.thisWeekContainer} >
                        <div className={styles.weeklyRun}>
                            <div className={styles.activitytarget}>
                                <p className="body-large"><span className="heading-4">x{countActivity}</span> sur objectif de {goal}</p>
                                <h3 className="body-default">Courses hebdomadaire réalisées</h3>
                            </div>
                            <div className={styles.activityTargetBarChart} >
                                <ActivityTargetBarChart
                                    completed={countActivity}
                                    goal={goal}
                                />
                            </div>
                        </div>
                        <div className={styles.statsResumes}>
                            <div className={styles.activityDuration}>
                                <h3 className="body-default">Durée d’activité</h3>
                                <p className="body-large"><span className="heading-4">{activityDuration}</span> minutes</p>
                            </div>
                            <div className={styles.activityDistance}>
                                <h3 className="body-default">Distance</h3>
                                <p className="body-large"><span className="heading-4">{activityDistance}</span> kilomètres</p>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}