import ScrollDuration from "@/components/ScrollDuration/ScrollDuration"
import styles from "./ChartHeartRate.module.css"
import HeartRateBarChart from "@/components/BarChart/HeartRateBarChart/HeartRateBarChart"
import { getHeartRate } from "@/utils/dataActivity";
import Loader from "@/components/Loader/Loader";
import { formatDateWeek } from "@/utils/date";
import useUserActivity from "@/hooks/useActivitySession";
import { useState } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

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

    console.log(error)

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
                                <HeartRateBarChart
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