import Head from "next/head";
import styles from "@/styles/CoachAI.module.css";
import useRequireAuth from "@/hooks/useRequireAuth";
import { AuthStatus } from "@/context/AuthContext";

export default function Home() {

    const status = useRequireAuth();

    if (status !== AuthStatus.Authenticated) return null;

    return (
        <>
            <Head>
                <title>Coach AI</title>
                <meta name="description" content="Coach AI Sportsee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                Page Coach AI
            </div>
        </>
    );
};
