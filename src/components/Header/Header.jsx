import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.css";
import useAuth, { AuthStatus } from "@/context/AuthContext";
import useChat from "@/context/ChatContext";
import Logo from '@/assets/logo.svg'

/**
 * Affiche l'en-tête de navigation de l'application.
 *
 * Le logo permet de revenir à la page d'accueil. Lorsque l'utilisateur
 * est authentifié et se trouve sur une page autre que l'accueil,
 * le menu de navigation ainsi que le bouton de déconnexion sont affichés.
 *
 * Le lien correspondant à la page actuellement visitée reçoit un style
 * spécifique afin d'indiquer la section active.
 *
 * Le bouton de déconnexion permet de mettre fin à la session de l'utilisateur.
 *
 * @returns {JSX.Element} L'en-tête contenant le logo et, si nécessaire,
 * le menu de navigation et le bouton de déconnexion.
 */
export default function Header() {
    const router = useRouter();
    const { status, logout } = useAuth();
    const pathname = router.pathname;
    const isAuthenticated = status === AuthStatus.Authenticated;
    const isNotHome = pathname !== '/';
    const showMenu = isAuthenticated && isNotHome;
    const { isOpen, toggleChat } = useChat();

    return (
        <header>
            <nav className={styles.nav + (showMenu ? ` ${styles.navWithMenu}` : '')}>
                <Link href="/">
                    <Logo
                        className={styles.logo}
                        width={157}
                        height={24}
                    />
                </Link>
                {showMenu && (
                    <div className={`${styles.menuContainer} body-default`}>
                        <div className={styles.menu}>
                            <Link className={(pathname === "/Dashboard" && !isOpen) ? styles.selected : undefined} href="/Dashboard">Dashboard</Link>
                            <button className={isOpen ? styles.selected : undefined} onClick={toggleChat}>Coach AI</button>
                            <Link className={(pathname === "/Profil" && !isOpen) ? styles.selected : undefined} href="/Profil">Mon profil</Link>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button className={styles.buttonLogout} onClick={logout}>Se déconnecter</button>
                        </div>
                    </div>
                )
                }
            </nav>
        </header>
    );
};