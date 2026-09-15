import Head from "next/head";
import styles from "./Dashboard.module.css";
import useRequireAuth from "@/hooks/useRequireAuth";
import { AuthStatus } from "@/context/AuthContext";
import Loader from "@/components/Loader/Loader";
import { GOAL_TARGET } from "@/config/constants";
import ThisWeek from "@/components/Conteneur/ThisWeek/ThisWeek";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import UserProfil from "@/components/UserProfil/UserProfil";
import ConversationAI from "@/components/Conteneur/ConversationAI/ConversationAI";
import GlobalDistance from "@/components/GlobalDistance/GlobalDistance";
import LastPerformance from "@/components/Conteneur/LastPerformance/LastPerformance";
import useUserInfoContext from "@/context/UserInfoContext";

/**
 * Affiche le tableau de bord principal de l'utilisateur authentifié.
 *
 * Le composant vérifie l'authentification de l'utilisateur avant d'afficher
 * son profil, sa distance totale, ses dernières performances et le résumé
 * de ses activités de la semaine.
 *
 * Les états de chargement et d'erreur liés aux informations utilisateur
 * sont également pris en charge.
 *
 * @returns {JSX.Element|null} Le tableau de bord de l'utilisateur authentifié,
 * ou `null` lorsque l'utilisateur n'est pas authentifié.
 */
export default function Home() {

    const status = useRequireAuth();

    const today = new Date();

    const { profile, statistics, loading, error } = useUserInfoContext();

    if (status !== AuthStatus.Authenticated) return null;

    return (
        <>
            <Head>
                <title>Dashboard | Sportsee</title>
                <meta name="description" content="Dashboard du profil utilisateur Sportsee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loading ? <Loader /> : error ? ErrorMessage({ error }) : (
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
                    </section>
                </div>
            )
            }
        </>
    );
};