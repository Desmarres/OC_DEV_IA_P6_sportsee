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
import { useEffect, useState } from "react";
import CalendarAI from "@/components/TrainingPlan/CalendarAI/CalendarAI";
import Target from "@/components/TrainingPlan/Target/Target";
import AvailableDays from "@/components/TrainingPlan/AvailableDays/AvailableDays";
import TimeSlot from "@/components/TrainingPlan/TimeSlot/TimeSlot";
import { useForm } from "react-hook-form";
import WeekRange from "@/components/TrainingPlan/WeekRange/WeekRange";
import { format } from "date-fns";
import useTraining from "@/context/TrainingContext";
import { useRouter } from "next/router";

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
 * horaire. La navigation entre les étapes est gérée via les paramètres de l'URL
 * et le planning est généré à partir des données du formulaire lors de sa soumission.
 *
 * Les états de chargement et d'erreur liés aux informations utilisateur
 * sont pris en charge avant l'affichage du tableau de bord.
 *
 * @returns {JSX.Element|null} Le tableau de bord de l'utilisateur authentifié,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function Home() {

    const status = useRequireAuth();
    const { generatePlan } = useTraining();

    const today = new Date();
    const { profile, statistics, loading, error } = useUserInfoContext();

    const { handleSubmit, control } = useForm();

    const router = useRouter();

    const steps = [
        "default",
        "target",
        "WeekRange",
        "availability",
        "timeSlot",
    ];

    const trainingPlanStep = router.query.trainingPlanStep;

    const trainingPlanIndexPage =
        typeof trainingPlanStep === "string" &&
            steps.includes(trainingPlanStep)
            ? trainingPlanStep
            : "default";

    const goToStep = (step) => {

        if (!steps.includes(step)) {
            return;
        }

        router.push(
            `/Dashboard?trainingPlanStep=${step}#trainingForm`,
            undefined,
            {
                shallow: true,
            }
        );
    };

    const nextPage = () => {

        const currentIndex =
            steps.indexOf(trainingPlanIndexPage);

        const nextStep =
            steps[currentIndex + 1];

        if (nextStep) {
            goToStep(nextStep);
        }
    };

    const previousPage = () => {

        const currentIndex =
            steps.indexOf(trainingPlanIndexPage);

        const previousStep =
            steps[currentIndex - 1];

        if (previousStep) {
            goToStep(previousStep);
        }
    };

    if (status !== AuthStatus.Authenticated) return null;

    const onSubmit = (data) => {

        const startDate = data.weekRange.start
            ? format(data.weekRange.start, "yyyy-MM-dd")
            : null
        const endDate = data.weekRange.end
            ? format(data.weekRange.end, "yyyy-MM-dd")
            : null
        generatePlan({
            target: data.target,
            startDate: startDate,
            endDate: endDate,
            availableDays: data.availableDays.sort(),
            timeSlot: data.timeSlot,
        });
    }

    const trainingPlanPage = {
        default: (
            <CalendarAI
                nextPage={nextPage}
            />
        ),
        target: (
            <Target
                control={control}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        ),
        WeekRange: (
            <WeekRange
                control={control}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        ),
        availability: (
            <AvailableDays
                control={control}
                previousPage={previousPage}
                nextPage={nextPage}
            />
        ),
        timeSlot: (
            <TimeSlot
                control={control}
                previousPage={previousPage}
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
                        <form id="trainingForm" className={styles.trainingForm} onSubmit={handleSubmit(onSubmit)}>
                            {trainingPlanPage[trainingPlanIndexPage]}
                        </form>
                    </section>
                </div>
            )
            }
        </>
    );
};