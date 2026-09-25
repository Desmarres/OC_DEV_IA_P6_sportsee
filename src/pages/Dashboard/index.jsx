import Head from "next/head";
import styles from "./Dashboard.module.css";
import useRequireAuth from "@/hooks/useRequireAuth";
import { AuthStatus } from "@/context/AuthContext";
import Loader from "@/components/Loader/Loader";
import ThisWeek from "@/components/Conteneur/ThisWeek/ThisWeek";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import UserProfil from "@/components/UserProfil/UserProfil";
import ConversationAI from "@/components/Conteneur/ConversationAI/ConversationAI";
import GlobalDistance from "@/components/GlobalDistance/GlobalDistance";
import LastPerformance from "@/components/Conteneur/LastPerformance/LastPerformance";
import useUserInfoContext from "@/context/UserInfoContext";
import { useState } from "react";
import CalendarAI from "@/components/TrainingPlan/CalendarAI/CalendarAI";
import Target from "@/components/TrainingPlan/Target/Target";
import AvailableDays from "@/components/TrainingPlan/AvailableDays/AvailableDays";
import TimeSlot from "@/components/TrainingPlan/TimeSlot/TimeSlot";
import { useForm } from "react-hook-form";
import WeekRange from "@/components/TrainingPlan/WeekRange/WeekRange";
import { format } from "date-fns";
import useTraining from "@/context/TrainingContext";

/**
 * Affiche le tableau de bord principal de l'utilisateur authentifié.
 *
 * Le composant affiche les informations principales du profil, la distance
 * totale parcourue, les dernières performances et le résumé des activités
 * de la semaine. Il intègre également l'accès à l'assistant IA et au formulaire
 * de création d'un planning d'entraînement personnalisé.
 *
 * Le formulaire guide l'utilisateur à travers plusieurs étapes afin de définir
 * son objectif, sa période d'entraînement, ses jours disponibles et son créneau
 * horaire. Les données sont ensuite préparées lors de la soumission du formulaire.
 *
 * Les états de chargement et d'erreur liés aux informations utilisateur
 * sont pris en charge avant l'affichage du tableau de bord.
 *
 * @returns {JSX.Element|null} Le tableau de bord de l'utilisateur authentifié,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function Home() {

    const status = useRequireAuth();
    const { toggleTraining } = useTraining();

    const today = new Date();
    const { profile, statistics, loading, error } = useUserInfoContext();

    const [calendarAIPage, setCalendarAIPage] = useState("default");
    const { handleSubmit, control } = useForm();

    const onSubmit = (data) => {
        toggleTraining();
        const startDate = data.weekRange.start
            ? format(data.weekRange.start, "yyyy-MM-dd")
            : null
        const endDate = data.weekRange.end
            ? format(data.weekRange.end, "yyyy-MM-dd")
            : null
        console.log("target : ", data.target);
        console.log("startDate : ", startDate);
        console.log("endDate : ", endDate);
        console.log("availableDays : ", data.availableDays.sort());
        console.log("timeSlot : ", data.timeSlot);
    }

    if (status !== AuthStatus.Authenticated) return null;

    const calendarPages = {
        default: (
            <CalendarAI
                nextPage={() => setCalendarAIPage("target")}
            />
        ),
        target: (
            <Target
                control={control}
                previousPage={() => setCalendarAIPage("default")}
                nextPage={() => setCalendarAIPage("WeekRange")}
            />
        ),
        WeekRange: (
            <WeekRange
                previousPage={() => setCalendarAIPage("target")}
                nextPage={() => setCalendarAIPage("availability")}
                control={control}
            />
        ),
        availability: (
            <AvailableDays
                previousPage={() => setCalendarAIPage("WeekRange")}
                nextPage={() => setCalendarAIPage("timeSlot")}
                control={control}
            />
        ),
        timeSlot: (
            <TimeSlot
                control={control}
                previousPage={() => setCalendarAIPage("availability")}
            />
        ),
    };

    return (
        <>
            <Head>
                <title>Dashboard | Sportsee</title>
                <meta name="description" content="Dashboard du profil utilisateur Sportsee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loading ? <Loader /> : error ? <ErrorMessage error={error} /> : (
                <div className={styles.profilContainer}>
                    <section className={styles.profilSummary}>
                        <ConversationAI />
                        <div className={styles.profilHeader}>
                            <UserProfil profile={profile} />
                            <GlobalDistance totalDistance={statistics.totalDistance} />
                        </div>
                    </section>
                    <section className={styles.profilStaty}>
                        <LastPerformance today={today} />
                        <ThisWeek
                            today={today}
                            goal={profile.weeklyGoal}
                        />
                        <form className={styles.trainingForm} onSubmit={handleSubmit(onSubmit)}>
                            {calendarPages[calendarAIPage]}
                        </form>
                    </section>
                </div>
            )
            }
        </>
    );
};