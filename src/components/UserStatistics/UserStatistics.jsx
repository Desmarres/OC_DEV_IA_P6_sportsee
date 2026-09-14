import { divideWithRemainder, getTotalCalories } from "@/utils/operation"
import StatisticalComponent from "../Conteneur/StatisticalComponent/StatisticalComponent"
import styles from "./UserStatistics.module.css"
import useUserActivity from "@/hooks/useActivitySession";
import Loader from "../Loader/Loader";
import { getNbRestDays, listFormatDate } from "@/utils/date";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

/**
 * Affiche les statistiques globales d'activité de l'utilisateur.
 *
 * Le composant présente la durée totale, la distance parcourue,
 * le nombre de sessions, les calories brûlées ainsi que le nombre
 * de jours de repos calculés à partir des activités de l'utilisateur.
 *
 * La durée totale est convertie en heures et minutes pour l'affichage.
 * Les données nécessaires au calcul des calories et des jours de repos
 * sont récupérées depuis la date d'inscription de l'utilisateur jusqu'à
 * la date actuelle.
 *
 * Les états de chargement et d'erreur liés à la récupération des activités
 * sont également pris en charge.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.statistics - Statistiques globales de l'utilisateur.
 * @param {number} props.statistics.totalDuration - Durée totale d'activité
 * en minutes.
 * @param {number} props.statistics.totalDistance - Distance totale parcourue
 * en kilomètres.
 * @param {number} props.statistics.totalSessions - Nombre total de sessions.
 * @param {Object} props.profile - Profil de l'utilisateur.
 * @param {string|Date} props.profile.createdAt - Date d'inscription
 * de l'utilisateur.
 *
 * @returns {JSX.Element} Un ensemble de statistiques d'activité,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function UserStatistics({ statistics, profile }) {

    const { quotient: hours, remainder: minutes } = divideWithRemainder(statistics.totalDuration, 60);

    let today = new Date();
    today = listFormatDate(today);

    const { data, loading, error } = useUserActivity(profile.createdAt, today.formatISO);

    const nbRestDays = getNbRestDays(data, today.date);
    const totalCalories = getTotalCalories(data);

    return (
        <div className={styles.userStatisticalContainer}>
            {
                loading ? <Loader /> : error ? ErrorMessage({ error }) : (

                    <>
                        <div className={styles.leftColumn}>
                            <StatisticalComponent
                                title={"Temps total couru"}
                                span={`${hours}h`}
                                unite={`${String(minutes).padStart(2, '0')}min`}
                            />
                            <StatisticalComponent
                                title={"Distance totale parcourue"}
                                span={statistics.totalDistance}
                                unite={"km"}
                            />
                            <StatisticalComponent
                                title={"Nombre de sessions"}
                                span={statistics.totalSessions}
                                unite={"sessions"}
                            />
                        </div>
                        <div className={styles.rightColumn}>
                            <StatisticalComponent
                                title={"Calories brûlées"}
                                span={totalCalories}
                                unite={"cal"}
                            />
                            <StatisticalComponent
                                title={"Nombre de jours de repos"}
                                span={nbRestDays}
                                unite={"jours"}
                            />
                        </div></>
                )
            }
        </div>
    )
}