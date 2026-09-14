import Link from 'next/link';
import styles from '@/styles/404.module.css';

/**
 * Affiche une page d'erreur personnalisée avec un message et un lien
 * permettant à l'utilisateur de revenir à la page d'accueil.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string} [props.error="404"] - Code ou titre de l'erreur à afficher.
 * @param {string} [props.message="Cette page n'existe pas."] - Message
 * décrivant l'erreur rencontrée.
 *
 * @returns {JSX.Element} La page d'erreur personnalisée.
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