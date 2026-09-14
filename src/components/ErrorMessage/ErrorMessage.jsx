import styles from './ErrorMessage.module.css';

/**
 * Affiche un message d'erreur à partir des informations fournies
 * par une erreur.
 *
 * Le composant présente le nom de l'erreur, son code de statut
 * ainsi que son message afin d'informer l'utilisateur du problème rencontré.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.error - Erreur contenant les informations
 * à afficher.
 *
 * @returns {JSX.Element} Un bloc affichant les informations de l'erreur.
 */
export default function ErrorMessage({ error }) {
    return (
        <div className={`${styles.pageContainer} heading-2`}>
            <h2 className="heading-2">{error.name} {error.status}</h2>
            <p className="body-default">{error.message}</p>
        </div>
    );

};