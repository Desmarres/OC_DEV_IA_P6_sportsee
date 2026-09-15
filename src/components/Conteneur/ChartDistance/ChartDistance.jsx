import Loader from "@/components/Loader/Loader";
import styles from "./ChartDistance.module.css"
import ScrollDuration from "@/components/ScrollDuration/ScrollDuration";
import KilometreBarChart from "@/components/BarChart/KilometreBarChart/KilometreBarChart";
import { getWeeklyDistances } from "@/utils/dataActivity";
import { formatDateRelativePeriod } from "@/utils/date";
import useUserActivity from "@/hooks/useActivitySession";
import { NUMBER_OF_WEEKS } from "@/config/constants";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

/**
 * Affiche un graphique représentant les distances parcourues
 * chaque semaine sur une période de quatre semaines.
 *
 * Les données sont récupérées en fonction de la période sélectionnée
 * et peuvent être parcourues semaine par semaine grâce au sélecteur
 * de période.
 *
 * Le composant gère également les états de chargement et d'erreur
 * lors de la récupération des données d'activité.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Date} [props.today=new Date()] - Date de référence utilisée
 * pour déterminer la période initiale affichée.
 *
 * @returns {JSX.Element} Le graphique des distances hebdomadaires,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function ChartDistance({ today = new Date() }) {

    const [period, setPeriod] = useState(formatDateRelativePeriod(today, 27));
    const { data, loading, error } = useUserActivity(period.startWeekPeriod.formatISO, period.endWeekPeriod.formatISO);

    const kilometresData = getWeeklyDistances(data, NUMBER_OF_WEEKS, period.endWeekPeriod.date)

    const changePeriod = (previous) => {
        const newEndWeekPeriod = new Date(period.endWeekPeriod.date);
        const days = previous ? -7 : 7;

        newEndWeekPeriod.setDate(newEndWeekPeriod.getDate() + days);

        setPeriod(formatDateRelativePeriod(newEndWeekPeriod));
    };

    return (
        <>
            {
                loading ?
                    <Loader /> :
                    error ?
                        ErrorMessage({ error }) :
                        <div className={styles.chartDistance}>
                            <ScrollDuration
                                title={"18km en moyenne"}
                                color={"var(--primary-color-100)"}
                                firstDate={period.startWeekPeriod.formatSmall}
                                lastDate={period.endWeekPeriod.formatSmall}
                                description={"Total des kilomètres sur 4 semaines"}
                                onClick={changePeriod}
                            />
                            <div className={styles.kilometreBarChart} >
                                <KilometreBarChart
                                    data={kilometresData}
                                    XDataKey={"semaine"}
                                    YDataKey={"kilometre"}
                                />
                            </div>
                        </div>
            }
        </>
    )
}
