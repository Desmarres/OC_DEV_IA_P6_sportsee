import { SMALL_MONTHS } from "@/config/constants";

/**
 * Formate une date selon le format français long.
 *
 * @param {string|Date} date - Date à formater.
 *
 * @returns {string} La date formatée sous la forme « jour mois année ».
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

/**
 * Génère plusieurs formats d'une même date pour faciliter son utilisation
 * dans l'application.
 *
 * @param {Date} date - Date à formater.
 *
 * @returns {{
 *   date: Date,
 *   formatISO: string,
 *   formatEuropean: string,
 *   formatSmall: string
 * }} La date d'origine ainsi que ses différentes représentations.
 */
export function listFormatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const smallMonth = SMALL_MONTHS[date.getMonth()]
    const day = String(date.getDate()).padStart(2, '0');

    return {
        date: date,
        formatISO: `${year}-${month}-${day}`,
        formatEuropean: `${day}/${month}/${year}`,
        formatSmall: `${day} ${smallMonth}`,
    }
}

/**
 * Détermine les dates de début et de fin de la semaine contenant
 * la date fournie, du lundi au dimanche.
 *
 * @param {Date} [date=new Date()] - Date de référence utilisée
 * pour déterminer la semaine.
 *
 * @returns {{
 *   startWeek: Object,
 *   endWeek: Object
 * }} Les informations de formatage du premier et du dernier jour
 * de la semaine.
 */
export function formatDateWeek(date = new Date()) {

    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 6);

    return {
        startWeek: listFormatDate(monday),
        endWeek: listFormatDate(nextMonday)
    };
}

/**
 * Détermine les dates de début et de fin d'une période relative
 * à partir d'une date donnée. La date de fin est ajustée au dimanche
 * suivant ou conservée si elle correspond déjà à un dimanche.
 *
 * @param {Date} [lastDay=new Date()] - Date de référence à partir
 * de laquelle est déterminée la fin de la période.
 * @param {number} [period=27] - Nombre de jours à soustraire à la
 * date de fin pour déterminer le début de la période.
 *
 * @returns {{
 *   startWeekPeriod: Object,
 *   endWeekPeriod: Object
 * }} Les informations de formatage du début et de la fin de la période.
 */
export function formatDateRelativePeriod(lastDay = new Date(), period = 27) {
    const endDay = new Date(lastDay);

    const daysUntilSunday = (7 - endDay.getDay()) % 7;
    endDay.setDate(endDay.getDate() + daysUntilSunday);

    const firstDay = new Date(endDay);
    firstDay.setDate(firstDay.getDate() - period);

    return {
        startWeekPeriod: listFormatDate(firstDay),
        endWeekPeriod: listFormatDate(endDay)
    };
}

/**
 * Génère les dernières semaines à partir d'une date de référence.
 *
 * Chaque semaine contient ses dates de début et de fin ainsi qu'une
 * distance initialisée à zéro, destinée à être complétée avec les activités.
 *
 * @param {number} [numberOfWeeks=4] - Nombre de semaines à générer.
 * @param {Date} [lastDay=new Date()] - Date de référence correspondant
 * à la dernière semaine.
 *
 * @returns {Array<Object>} Liste des semaines avec leurs dates de début,
 * de fin et leur distance initialisée à zéro.
 */
export function getLastWeeks(numberOfWeeks = 4, lastDay = new Date()) {
    const currentWeek = formatDateWeek(lastDay);

    const weeks = [];

    for (let i = numberOfWeeks - 1; i >= 0; i--) {
        const monday = new Date(currentWeek.startWeek.date);
        monday.setDate(monday.getDate() - i * 7);

        weeks.push({
            ...formatDateWeek(monday),
            distance: 0,
        });
    }

    return weeks;
}

/**
 * Recherche l'activité la plus récente parmi une liste d'activités.
 *
 * @param {Array<Object>} activities - Liste des activités de l'utilisateur.
 *
 * @returns {Object|null} L'activité la plus récente ou `null` si aucune
 * activité n'est disponible.
 */
function getLastActivity(activities) {

    if (!activities || activities.length === 0) return null;

    return activities.reduce((latest, activity) => {
        return activity.date > latest.date ? activity : latest;
    });
}

/**
 * Calcule le nombre de jours écoulés depuis la dernière activité
 * jusqu'à une date de référence.
 *
 * @param {Array<Object>} activities - Liste des activités de l'utilisateur.
 * @param {Date} [referenceDay=new Date()] - Date de référence utilisée
 * pour calculer le nombre de jours de repos.
 *
 * @returns {number|null} Nombre de jours écoulés depuis la dernière activité,
 * ou `null` si aucune activité n'est disponible.
 */
export function getNbRestDays(activities, referenceDay = new Date()) {

    const latestActivity = getLastActivity(activities);

    if (!latestActivity) {
        return null;
    }

    const latestActivityDate = new Date(latestActivity.date);

    const differenceInDays = Math.floor(
        (referenceDay - latestActivityDate) / (1000 * 60 * 60 * 24)
    );

    return differenceInDays
}