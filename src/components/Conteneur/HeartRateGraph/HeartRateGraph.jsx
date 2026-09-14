import ScrollDuration from "@/components/ScrollDuration/ScrollDuration"
import styles from "./HeartRateGraph.module.css"
import { getHeartRate } from "@/utils/dataActivity";
import Loader from "@/components/Loader/Loader";
import { formatDateWeek } from "@/utils/date";
import useUserActivity from "@/hooks/useActivitySession";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import HeartRateGraph from "@/components/BarChart/HeartRateBarChart/HeartRateBarChart";

/**
 * Affiche un graphique représentant l'évolution de la fréquence cardiaque
 * sur une semaine.
 *
 * Les données de fréquence cardiaque sont récupérées pour la période
 * sélectionnée et affichent les valeurs minimale, maximale et moyenne
 * pour chaque jour. La période peut être parcourue semaine par semaine.
 *
 * Le composant gère également les états de chargement et d'erreur
 * lors de la récupération des données d'activité.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Date} [props.today=new Date()] - Date de référence utilisée
 * pour déterminer la semaine initialement affichée.
 *
 * @returns {JSX.Element} Le graphique de fréquence cardiaque,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function ChartHeartRate({ today = new Date() }) {

    const [period, setPeriod] = useState(formatDateWeek(today))
    const { data, loading, error } = useUserActivity(period.startWeek.formatISO, period.endWeek.formatISO);

    const { heartRates, weeklyAverage } = getHeartRate(data, period.startWeek.date)

    const changePeriod = (previous) => {
        const newStartPeriod = new Date(period.startWeek.date);
        const days = previous ? -7 : 7;

        newStartPeriod.setDate(newStartPeriod.getDate() + days);

        setPeriod(formatDateWeek(newStartPeriod));
    };

    return (
        <>
            {
                loading ?
                    <Loader /> :
                    error ?
                        ErrorMessage({ error }) :
                        <div className={styles.chartHeartRate}>
                            <ScrollDuration
                                title={`${weeklyAverage} BPM`}
                                color={"var(--secondary-color-100)"}
                                firstDate={period.startWeek.formatSmall}
                                lastDate={period.endWeek.formatSmall}
                                description={"Fréquence cardiaque moyenne"}
                                onClick={changePeriod}
                            />
                            <div className={styles.heartRateBarChart} >
                                <HeartRateGraph
                                    data={heartRates}
                                    XDataKey={"day"}
                                    BarDataKey={["min", "max", "average"]}
                                />
                            </div>
                        </div>
            }
        </>
    )
}