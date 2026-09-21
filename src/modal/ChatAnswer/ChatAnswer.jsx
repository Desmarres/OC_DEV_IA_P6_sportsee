import LoaderPoint from "@/components/LoaderPoint/LoaderPoint";
import styles from "./ChatAnswer.module.css";
import IconAI from '@/assets/IconeAI.svg'
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Markdown from "react-markdown";

/**
 * Affiche la réponse de l'assistant IA dans la conversation.
 *
 * Le composant affiche un indicateur de chargement pendant le traitement
 * de la requête, puis la réponse de l'assistant au format Markdown.
 * En cas d'erreur, le message d'erreur correspondant est affiché.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {boolean} props.loading - Indique si une réponse est actuellement
 * en cours de traitement.
 * @param {string} props.answer - Réponse générée par l'assistant IA.
 * @param {Error|null} props.error - Erreur éventuelle survenue lors
 * du traitement de la requête.
 *
 * @returns {JSX.Element} Le message de réponse de l'assistant,
 * un indicateur de chargement ou un message d'erreur.
 */
export default function ChatAnswer({ loading, answer, error }) {
    return (
        <div className={styles.chatAnswerContainer}>
            <div className={`${styles.imageContainer} ${styles.iconAI}`}>
                <IconAI
                    color="#FCC1B6"
                    width={20}
                    height={20}
                />
            </div>
            {(loading) ? (
                <div className={styles.loaderContainer}>
                    <LoaderPoint />
                </div>
            ) : answer ? (
                <div className={styles.chatAnswerMain}>
                    <p className="body-small">Coach AI</p>
                    <div className={styles.chatAnswer}>
                        <Markdown>{answer}</Markdown>
                    </div>
                </div>
            ) : error ? (
                <ErrorMessage error={error} />
            ) : null}
        </div>
    );
}