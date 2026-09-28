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
import { useEffect } from "react";
import CalendarAI from "@/components/TrainingPlan/CalendarAI/CalendarAI";
import Target from "@/components/TrainingPlan/Target/Target";
import AvailableDays from "@/components/TrainingPlan/AvailableDays/AvailableDays";
import TimeSlot from "@/components/TrainingPlan/TimeSlot/TimeSlot";
import { useForm, useWatch, Watch } from "react-hook-form";
import WeekRange from "@/components/TrainingPlan/WeekRange/WeekRange";
import { format } from "date-fns";
import useTraining from "@/context/TrainingContext";
import { useRouter } from "next/router";

const steps = ["default", "target", "WeekRange", "availability", "timeSlot"];

// Champ du formulaire associé à chaque étape
const STEP_FIELDS = {
    target: "target",
    WeekRange: "weekRange",
    availability: "availableDays",
    timeSlot: "timeSlot",
};

// Règle de validité de chaque champ
const FIELD_VALIDATORS = {
    target: (value) => Boolean(value),
    weekRange: (value) => Boolean(value?.start && value?.end),
    availableDays: (value) => Array.isArray(value) && value.length > 0,
    timeSlot: (value) => Boolean(value),
};

const FIELD_ERRORS = {
    target: "Veuillez choisir un objectif.",
    weekRange: "Veuillez sélectionner une date de début et de fin.",
    availableDays: "Veuillez sélectionner au moins un jour.",
    timeSlot: "Veuillez choisir un créneau horaire.",
};

const isStepValid = (step, values) => {
    const field = STEP_FIELDS[step];
    return !field || FIELD_VALIDATORS[field](values?.[field]);
};

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
    const { generatePlan } = useTraining();
    const today = new Date();
    const { profile, statistics, loading, error } = useUserInfoContext();

    const { handleSubmit, control, setError, clearErrors } = useForm({
        defaultValues: {
            target: "",
            weekRange: { start: null, end: null },
            availableDays: [],
            timeSlot: "",
        },
    });

    const router = useRouter();
    const values = useWatch({ control });

    const trainingPlanStep = router.query.trainingPlanStep;
    const trainingPlanIndexPage =
        typeof trainingPlanStep === "string" && steps.includes(trainingPlanStep)
            ? trainingPlanStep
            : "default";

    const currentIndex = steps.indexOf(trainingPlanIndexPage);

    const firstInvalidIndex = steps.findIndex(
        (step) => !isStepValid(step, values)
    );

    const isStepAllowed =
        firstInvalidIndex === -1 || currentIndex <= firstInvalidIndex;

    const goToStep = (step, replace = false) => {
        if (!steps.includes(step)) return;
        const navigate = replace ? router.replace : router.push;
        navigate(`/Dashboard?trainingPlanStep=${step}#trainingForm`, undefined, {
            shallow: true,
        });
    };

    // Garde : redirige si on arrive directement sur une étape par l'URL
    useEffect(() => {
        if (!router.isReady || isStepAllowed) return;
        goToStep(steps[firstInvalidIndex], true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, isStepAllowed, firstInvalidIndex]);

    const nextPage = () => {
        const field = STEP_FIELDS[trainingPlanIndexPage];

        if (field && !FIELD_VALIDATORS[field](values[field])) {
            setError(field, { type: "required", message: FIELD_ERRORS[field] });
            return;
        }
        if (field) clearErrors(field);

        const nextStep = steps[currentIndex + 1];
        if (nextStep) goToStep(nextStep);
    };

    const previousPage = () => {
        const previousStep = steps[currentIndex - 1];
        if (previousStep) goToStep(previousStep);
    };

    if (status !== AuthStatus.Authenticated) return null;

    const onSubmit = (data) => {
        // Dernière vérification : on bloque si un champ manque
        const invalidStep = steps.find((step) => !isStepValid(step, data));
        if (invalidStep) {
            const field = STEP_FIELDS[invalidStep];
            setError(field, { type: "required", message: FIELD_ERRORS[field] });
            goToStep(invalidStep);
            return;
        }

        generatePlan({
            target: data.target,
            startDate: format(data.weekRange.start, "yyyy-MM-dd"),
            endDate: format(data.weekRange.end, "yyyy-MM-dd"),
            availableDays: [...data.availableDays].sort(),
            timeSlot: data.timeSlot,
        });
    };

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
                            {isStepAllowed ? trainingPlanPage[trainingPlanIndexPage] : null}
                        </form>
                    </section>
                </div>
            )
            }
        </>
    );
};