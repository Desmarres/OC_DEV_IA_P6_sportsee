import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import useAuth, { AuthStatus } from "@/context/AuthContext";

/**
 * Affiche le pied de page de l'application pour les utilisateurs
 * authentifiés et présents sur une page autre que la page d'accueil.
 *
 * Le pied de page contient les mentions de copyright, les liens
 * de navigation ainsi que le logo de l'application.
 *
 * @returns {JSX.Element} Le pied de page de l'application lorsqu'il
 * doit être affiché, ou un fragment vide dans le cas contraire.
 */
export default function Footer() {
    const router = useRouter();
    const { status } = useAuth();
    const pathname = router.pathname;
    const isAuthenticated = status === AuthStatus.Authenticated;
    const isNotHome = pathname !== '/';
    const showFooter = isAuthenticated && isNotHome;

    return (
        <>
            {showFooter && (
                <footer className={`${styles.container} body-default`}>
                    <div className={styles.copyRight}>
                        <p>©Sportsee</p>
                        <p>Tous droits réservés</p>
                    </div>
                    <nav className={styles.menu}>
                        <Link href="/">Conditions générales</Link>
                        <Link href="/">Contact</Link>
                        <Link href="/">
                            <Image
                                src="/logoShort.svg"
                                alt="Logo Sportsee"
                                className={styles.logo}
                                width={19}
                                height={21}
                                loading='eager'
                            />
                        </Link>
                    </nav>
                </footer>
            )}
        </>
    )
}