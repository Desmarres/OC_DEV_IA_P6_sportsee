import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';
import useAuth, { AuthStatus } from '@/context/AuthContext';

/**
 * Affiche l'en-tête de navigation de l'application.
 *
 * Le logo permet de revenir à la page d'accueil. Lorsque l'utilisateur
 * est authentifié et se trouve sur une page autre que l'accueil,
 * le menu de navigation ainsi que le bouton de déconnexion sont affichés.
 *
 * La page actuellement visitée est identifiée afin d'appliquer un style
 * spécifique au lien de navigation correspondant.
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

    return (
        <header>
            <nav className={styles.nav}>
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="Logo Sportsee"
                        className={styles.logo}
                        width={157}
                        height={24}
                        loading='eager'
                    />
                </Link>
                {showMenu && (
                    <div className={`${styles.menuContainer} body-default`}>
                        <div className={styles.menu}>
                            <Link className={pathname === "/Dashboard" ? styles.selected : undefined} href="/Dashboard">Dashboard</Link>
                            <Link className={pathname === "/CoachAI" ? styles.selected : undefined} href="/CoachAI">Coach AI</Link>
                            <Link className={pathname === "/Profil" ? styles.selected : undefined} href="/Profil">Mon profil</Link>
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