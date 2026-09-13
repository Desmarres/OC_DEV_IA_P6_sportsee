import Loader from "@/components/Loader/Loader";
import styles from "./ChartDistance.module.css"
import ScrollDuration from "@/components/ScrollDuration/ScrollDuration";
import KilometreBarChart from "@/components/BarChart/KilometreBarChart/KilometreBarChart";
import { getWeeklyDistances } from "@/utils/dataActivity";
import { formatDateRelativePeriod } from "@/utils/date";
import useUserActivity from "@/hooks/useActivitySession";
import { numberOfWeeks } from "@/config/constants";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function ChartDistance({ today = new Date() }) {

    const [period, setPeriod] = useState(formatDateRelativePeriod(today, 28));
    const { data, loading, error } = useUserActivity(period.startWeekPeriod.formatISO, period.endWeekPeriod.formatISO);

    const kilometresData = getWeeklyDistances(data, numberOfWeeks, period.endWeekPeriod.date)

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
