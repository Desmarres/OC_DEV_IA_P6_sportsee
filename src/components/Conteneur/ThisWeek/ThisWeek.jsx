import ActivityTargetBarChart from "@/components/BarChart/ActivityTargetBarChart/ActivityTargetBarChart"
import styles from "./ThisWeek.module.css"
import { formatDateWeek } from "@/utils/date";
import useUserActivity from "@/hooks/useActivitySession";
import Loader from "@/components/Loader/Loader";
import { goalTarget } from "@/config/constants";
import { getAggregateActivityMetrics } from "@/utils/dataActivity";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function ThisWeek({ today = new Date(), goal = goalTarget }) {

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
                                <p className="body-large"><span className="heading-4">x{countActivity}</span> sur objectif de {goalTarget}</p>
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