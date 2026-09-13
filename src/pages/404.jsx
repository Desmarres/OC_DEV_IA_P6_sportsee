import Link from 'next/link';
import styles from '@/styles/404.module.css';

/**
 * Affiche un bloc d'erreur personnalisée lorsque la page demandée
 * n'existe pas.
 *
 * La page informe l'utilisateur de l'erreur et lui propose un lien
 * permettant de revenir à la page d'accueil.
 *
 * @returns {JSX.Element} Le composant contenant la page d'erreur 404.
 */
export default function Custom404({ error = "404", message = "Cette page n'existe pas." }) {
    return (
        <div className={`${styles.pageContainer} heading-2`}>
            <h1 className={`heading-1`}>{error}</h1>
            <p>{message}</p>
            <Link href="/">Retour à l&apos;accueil</Link>
        </div>
    );

};