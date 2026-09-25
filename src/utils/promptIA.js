
import { DAYS } from "@/config/constants";
import { divideWithRemainder } from "./operation";

/**
 * Formate les informations du profil, les statistiques globales
 * et les dernières activités de l'utilisateur sous forme de texte.
 *
 * Les données disponibles sont regroupées en sections afin de produire
 * un résumé lisible pouvant notamment être utilisé comme contexte
 * pour une conversation avec l'assistant IA.
 *
 * @param {Object|null} profile - Informations du profil utilisateur.
 * @param {Object|null} statistics - Statistiques globales de l'utilisateur.
 * @param {Array<Object>} lastActivities - Liste des dernières activités.
 *
 * @returns {string} Un résumé textuel du profil, des statistiques
 * et des dernières activités de l'utilisateur.
 */
export function formatInfosProfilLastActivities(profile, statistics, lastActivities, weeklyGoal) {

    let describesProfil = "Nous n'avons pas pu récupérer les informations de l'utilisateur.";

    if (profile || statistics) {
        const profilInfos = [];

        if (profile?.firstName) {
            profilInfos.push(profile.firstName);
        }

        if (profile?.age != null) {
            profilInfos.push(`${profile.age} ans`);
        }

        if (profile?.weight != null) {
            profilInfos.push(`${profile.weight} kg`);
        }

        if (weeklyGoal && profile?.weeklyGoal != null) {
            profilInfos.push(`objectif : ${profile.weeklyGoal} séances/semaine`);
        }

        const statistiquesInfos = [];

        if (statistics?.totalSessions != null) {
            statistiquesInfos.push(`${statistics.totalSessions} séances au total`);
        }

        if (statistics?.totalDuration != null) {
            const { quotient: hours, remainder: minutes } =
                divideWithRemainder(statistics.totalDuration, 60);

            statistiquesInfos.push(
                `${hours}h ${String(minutes).padStart(2, "0")}min courues au total`
            );
        }

        if (statistics?.totalDistance != null) {
            statistiquesInfos.push(
                `${statistics.totalDistance} km parcourus`
            );
        }

        const sections = [];

        if (profilInfos.length > 0) {
            sections.push(`Profil de l'utilisateur : ${profilInfos.join(", ")}.`);
        }

        if (statistiquesInfos.length > 0) {
            sections.push(`Statistiques globales : ${statistiquesInfos.join(", ")}.`);
        }

        if (sections.length > 0) {
            describesProfil = sections.join("\n");
        }
    }

    const describesActivities =
        Array.isArray(lastActivities) && lastActivities.length > 0
            ? `${lastActivities.length} dernières courses :\n${lastActivities
                .map((activity) => {
                    const infos = [];

                    if (activity?.date) {
                        infos.push(activity.date);
                    }

                    if (activity?.distance != null) {
                        infos.push(`${activity.distance} km`);
                    }

                    if (activity?.duration != null) {
                        infos.push(`${activity.duration} min`);
                    }

                    if (activity?.heartRate?.average != null) {
                        infos.push(`FC moyenne ${activity.heartRate.average} bpm`);
                    }

                    if (activity?.caloriesBurned != null) {
                        infos.push(`${activity.caloriesBurned} kcal`);
                    }

                    return infos.length > 0
                        ? `- ${infos.join(" : ")}`
                        : null;
                })
                .filter(Boolean)
                .join("\n")}`
            : "Nous n'avons pas pu récupérer ses dernières activités.";

    return [describesProfil, describesActivities].join("\n\n");
}

export function formatRequestTrainingPlan(target, startDate, endDate, availableDays, timeSlot, numberOfWeeks) {

    const targetMessage = `Génère moi un plan d'entraînement afin de pouvoir réaliser mon objectif de ${target}.`;

    const periodsTrainingMessage = `Je souhaite commencer à partir du ${startDate} et 
    terminer au ${endDate}, soit ${numberOfWeeks} semaines calendaires.`;

    const slotsTrainingMessage = `Je suis disponibles sur les jours ${availableDays.map((day) => {
        return ` ${day} (${DAYS[day].long})`;
    })
        .join(", ")
        } et je m'entraine sur le créneau ${timeSlot}.`;

    return [targetMessage, periodsTrainingMessage, slotsTrainingMessage].join("\n");
}