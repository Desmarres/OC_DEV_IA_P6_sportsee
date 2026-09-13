import Head from "next/head";
import styles from "./Dashboard.module.css";
import useRequireAuth from "@/hooks/useRequireAuth";
import { AuthStatus } from "@/context/AuthContext";
import useUserInfo from "@/hooks/useUserInfo";
import Loader from "@/components/Loader/Loader";
import { goalTarget } from "@/config/constants";
import ThisWeek from "@/components/Conteneur/ThisWeek/ThisWeek";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import UserProfil from "@/components/UserProfil/UserProfil";
import ConversationAI from "@/components/Conteneur/ConversationAI/ConversationAI";
import GlobalDistance from "@/components/GlobalDistance/GlobalDistance";
import LastPerformance from "@/components/Conteneur/LastPerformance/LastPerformance";


export default function Home() {

    const status = useRequireAuth();

    const today = new Date();

    const { profile, statistics, loading, error } = useUserInfo(status === AuthStatus.Authenticated);

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
                            goal={goalTarget}
                        />
                    </section>
                </div>
            )
            }
        </>
    );
};