import { SMALL_MONTHS } from "@/config/constants";
import { getLastActivity } from "./dataActivity";

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
 * Génère plusieurs représentations d'une même date pour faciliter
 * son utilisation dans différentes parties de l'application.
 *
 * @param {Date} [date=new Date()] - Date à formater.
 *
 * @returns {{
 *   date: Date,
 *   formatISO: string,
 *   formatEuropean: string,
 *   formatSmall: string
 * }} La date d'origine ainsi que ses différentes représentations.
 */
export function listFormatDate(date = new Date()) {
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

    const monday = getMonday(date);

    const nextSunday = new Date(monday);
    nextSunday.setDate(nextSunday.getDate() + 6);

    return {
        startWeek: listFormatDate(monday),
        endWeek: listFormatDate(nextSunday)
    };
}

/**
 * Calcule le lundi correspondant à une date donnée.
 *
 * Le calcul tient compte du dimanche comme premier jour de la semaine
 * afin de déterminer le lundi de la semaine correspondante.
 *
 * @param {Date} date - Date de référence utilisée pour déterminer la semaine.
 *
 * @returns {Date} Date correspondant au lundi de la semaine.
 */
function getMonday(date) {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    return monday;
}

/**
 * Détermine les dates de début et de fin d'une période relative
 * à partir d'une date donnée.
 *
 * La date de fin est ajustée au dimanche suivant ou conservée si elle
 * correspond déjà à un dimanche. La date de début est ensuite calculée
 * en soustrayant le nombre de jours indiqué.
 *
 * @param {Date} [lastDay=new Date()] - Date de référence utilisée
 * pour déterminer la fin de la période.
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

/**
 * Vérifie qu'une valeur correspond à une date valide au format ISO `YYYY-MM-DD`.
 *
 * La fonction contrôle d'abord le format de la date à l'aide d'une expression
 * régulière, puis vérifie que la date existe réellement afin de détecter
 * les dates invalides comme le 30 février ou le 31 avril.
 *
 * @param {string} value - Valeur représentant la date à vérifier.
 *
 * @returns {boolean} `true` si la valeur correspond à une date ISO valide,
 * sinon `false`.
 */
export function isValidISODate(value) {

    const regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const match = regex.exec(value);

    if (!match) return false;

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

/**
 * Vérifie qu'une chaîne correspond à un créneau horaire valide.
 *
 * Le format attendu est `HHhMM-HHhMM`, avec les minutes facultatives,
 * et des heures comprises entre 0 et 23 et des minutes entre 00 et 59.
 *
 * @param {string} chaine - Chaîne représentant le créneau horaire à vérifier.
 *
 * @returns {boolean} `true` si le créneau respecte le format attendu,
 * sinon `false`.
 */
export function isValidTimeSlot(chaine) {
    const regexCreneau = /^(0?[0-9]|1[0-9]|2[0-3])h([0-5][0-9])?-(0?[0-9]|1[0-9]|2[0-3])h([0-5][0-9])?$/;

    return regexCreneau.test(chaine);
}

/**
 * Calcule le nombre de semaines comprises entre deux dates.
 *
 * Le calcul commence au lundi de la semaine contenant la date de début
 * et compte chaque semaine jusqu'à la date de fin incluse.
 *
 * @param {string} startDate - Date de début au format `YYYY-MM-DD`.
 * @param {string} endDate - Date de fin au format `YYYY-MM-DD`.
 *
 * @returns {number} Nombre de semaines comprises dans la période.
 */
export function getNumberOfWeeks(startDate, endDate) {

    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    const monday = getMonday(start);

    let nbSemaine = 0;

    while (monday <= end) {
        nbSemaine += 1;
        monday.setDate(monday.getDate() + 7);
    }

    return nbSemaine;
};
