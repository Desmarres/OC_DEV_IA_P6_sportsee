import { DAYS } from "@/config/constants";
import { getLastWeeks, listFormatDate } from "./date";

/**
 * Calcule les distances totales parcourues pour chaque semaine
 * sur une période donnée.
 *
 * @param {Array<Object>} data - Liste des activités de l'utilisateur.
 * @param {number} [numberOfWeeks=4] - Nombre de semaines à prendre en compte.
 * @param {Date} [lastDay=new Date()] - Date de référence correspondant
 * au dernier jour de la période.
 *
 * @returns {Array<Object>} Liste des distances hebdomadaires au format
 * `{ semaine, kilometre }`.
 */
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

/**
 * Calcule les statistiques globales d'une liste d'activités.
 *
 * Additionne le nombre d'activités, la distance totale parcourue
 * et la durée totale des activités.
 *
 * @param {Array<Object>} data - Liste des activités de l'utilisateur.
 *
 * @returns {{
 *   countActivity: number,
 *   activityDistance: number,
 *   activityDuration: number
 * }} Les statistiques agrégées des activités.
 */
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

/**
 * Calcule les données de fréquence cardiaque pour chaque jour
 * d'une période de sept jours ainsi que la fréquence cardiaque moyenne
 * sur l'ensemble de la période.
 *
 * @param {Array<Object>} data - Liste des activités de l'utilisateur.
 * @param {Date} day - Date correspondant au premier jour de la période.
 *
 * @returns {{
 *   heartRates: Array<Object>,
 *   weeklyAverage: number
 * }} Les données de fréquence cardiaque quotidiennes et la moyenne
 * hebdomadaire.
 */
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
                day: DAYS[i],
                min: activity.heartRate.min,
                max: activity.heartRate.max,
                average: activity.heartRate.average
            });

            totalAverage += activity.heartRate.average;
            countAverage++;
        } else {
            heartRates.push({
                day: DAYS[i],
                min: null,
                max: null,
                average: null
            });
        }
    }

    let weeklyAverage = countAverage > 0
        ? totalAverage / countAverage
        : 0;

    weeklyAverage = Number(weeklyAverage.toFixed(0))

    return {
        heartRates,
        weeklyAverage
    };
}
