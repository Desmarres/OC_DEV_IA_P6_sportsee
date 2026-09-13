import { days } from "@/config/constants";
import { getLastWeeks, listFormatDate } from "./date";

export function getWeeklyDistances(data, numberOfWeeks = 4, lastDay = new Date()) {
    const weeks = getLastWeeks(numberOfWeeks, lastDay);

    data.forEach((activity) => {
        const activityDate = activity.date;

        const week = weeks.find((week) => {
            const start = week.startWeek.formatISO;
            const end = week.endWeek.formatISO;

            return activityDate >= start && activityDate <= end;
        });

        if (week) {
            week.distance += activity.distance;
        }
    });

    const kilometresData = [
        { semaine: 'S1', kilometre: weeks[0].distance },
        { semaine: 'S2', kilometre: weeks[1].distance },
        { semaine: 'S3', kilometre: weeks[2].distance },
        { semaine: 'S4', kilometre: weeks[3].distance },
    ];

    return kilometresData;
}

export function getAggregateActivityMetrics(data) {

    const countActivity = data.length;

    let activityDistance = 0;
    let activityDuration = 0;

    data.forEach((activity) => {
        activityDistance += activity.distance;
        activityDuration += activity.duration;
    });

    activityDistance = Number(activityDistance.toFixed(1));

    return {
        countActivity,
        activityDistance,
        activityDuration
    };
}

export function getHeartRate(data, day) {

    const heartRates = [];
    let totalAverage = 0;
    let countAverage = 0;

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(day);
        currentDay.setDate(day.getDate() + i);

        const { formatISO } = listFormatDate(currentDay);

        const activity = data.find((activity) => {
            return activity.date === formatISO;
        });

        if (activity) {
            heartRates.push({
                day: days[i],
                min: activity.heartRate.min,
                max: activity.heartRate.max,
                average: activity.heartRate.average
            });

            totalAverage += activity.heartRate.average;
            countAverage++;
        } else {
            heartRates.push({
                day: days[i],
                min: null,
                max: null,
                average: null
            });
        }
    }

    const weeklyAverage = countAverage > 0
        ? totalAverage / countAverage
        : 0;

    return {
        heartRates,
        weeklyAverage
    };
}
