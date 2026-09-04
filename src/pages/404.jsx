import Link from 'next/link';
import styles from '@/styles/404.module.css';

/**
 * Affiche une page d'erreur 404 personnalisée lorsque la page demandée
 * n'existe pas.
 *
 * La page informe l'utilisateur de l'erreur et lui propose un lien
 * permettant de revenir à la page d'accueil.
 *
 * @returns {JSX.Element} Le composant contenant la page d'erreur 404.
 */
export default function Custom404() {
    return (
        <div className={`${styles.pageContainer} heading-2`}>
            <h1 className={`heading-1`}>404</h1>
            <p>Cette page n&apos;existe pas.</p>
            <Link href="/">Retour à l&apos;accueil</Link>
        </div>
    );

};