import { API_URL, DAYS } from "@/config/constants";
import { formatDateRelativePeriod, getLastWeeks, listFormatDate } from "./date";

/**
 * Récupère les dernières activités de l'utilisateur sur une période
 * calculée à partir du nombre d'activités souhaité et de l'objectif
 * hebdomadaire.
 *
 * Les activités récupérées sont limitées au nombre demandé.
 * En cas d'erreur lors de la requête ou de réponse HTTP invalide,
 * la fonction retourne `null`.
 *
 * @param {string} token - Token d'authentification utilisé pour la requête.
 * @param {number} nbActivity - Nombre d'activités à récupérer.
 * @param {number} weeklyGoal - Objectif hebdomadaire d'activités.
 *
 * @returns {Promise<Array<Object>|null>} Les dernières activités récupérées
 * ou `null` en cas d'erreur.
 */
export async function getLastActivities(token, nbActivity, weeklyGoal) {

    const nbDayPerWeek = 7
    const safetyFactor = 2
    const maxWeek = Math.ceil(nbActivity / weeklyGoal) * nbDayPerWeek * safetyFactor;
    const today = listFormatDate();

    const { startWeekPeriod, endWeekPeriod } =
        formatDateRelativePeriod(today.formatISO, maxWeek);

    try {
        const response = await fetch(
            `${API_URL}/api/user-activity?startWeek=${startWeekPeriod.formatISO}&endWeek=${endWeekPeriod.formatISO}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error(
                "Impossible de récupérer les activités :",
                response.status
            );
            return null;
        }

        const data = await response.json();

        return data.slice(-nbActivity);

    } catch (error) {
        console.error("Erreur lors de la récupération des activités :", error);
        return null;
    }
}


/**
 * Calcule les distances totales parcourues pour chaque semaine
 * sur une période donnée.
 *
 * Les activités sont associées à leur semaine respective puis leurs distances
 * sont additionnées. Le résultat est retourné sous la forme de quatre valeurs
 * correspondant aux quatre semaines affichées par le graphique.
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
 * et la durée totale des activités. La distance totale est arrondie
 * à une décimale.
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
 * Pour chaque jour, les valeurs minimale, maximale et moyenne sont récupérées
 * lorsqu'une activité est disponible. Les jours sans activité sont représentés
 * par des valeurs `null`.
 *
 * @param {Array<Object>} data - Liste des activités de l'utilisateur.
 * @param {Date} day - Date correspondant au premier jour de la période.
 *
 * @returns {{
 *   heartRates: Array<Object>,
 *   weeklyAverage: number
 * }} Les données de fréquence cardiaque quotidiennes et la moyenne
 * hebdomadaire arrondie à l'entier.
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
