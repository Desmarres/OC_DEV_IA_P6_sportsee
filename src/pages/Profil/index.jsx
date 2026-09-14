import Head from "next/head";
import styles from "./Profil.module.css";
import useRequireAuth from "@/hooks/useRequireAuth";
import { AuthStatus } from "@/context/AuthContext";
import UserProfil from "@/components/UserProfil/UserProfil";
import useUserInfoContext from "@/context/UserInfoContext";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import UserProfilDetail from "@/components/UserProfilDetail/UserProfilDetail";
import { formatDate } from "@/utils/date";
import UserStatistics from "@/components/UserStatistics/UserStatistics";

export default function Home() {

    const status = useRequireAuth();

    const { profile, statistics, loading, error } = useUserInfoContext();

    if (status !== AuthStatus.Authenticated) return null;

    return (
        <>
            <Head>
                <title>Profil | Sportsee</title>
                <meta name="description" content="Page du profil utilisateur Sportsee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.mainContainer}>
                {
                    loading ? <Loader /> : error ? ErrorMessage({ error }) : (
                        <>
                            <div className={styles.profilContainer}>
                                <div className={styles.userProfil}>
                                    <UserProfil profile={profile} />
                                </div>
                                <UserProfilDetail profile={profile} />
                            </div>
                            <div className={styles.statisticsContainer}>
                                <div className={styles.statisticsTitle}>
                                    <h2 className="heading-4">Vos statistiques</h2>
                                    <p className="body-default">depuis le {(profile.createdAt) && formatDate(profile.createdAt)}</p>
                                </div>
                                <UserStatistics
                                    statistics={statistics}
                                    profile={profile}
                                />
                            </div></>
                    )
                }
            </div>
        </>
    );
};
