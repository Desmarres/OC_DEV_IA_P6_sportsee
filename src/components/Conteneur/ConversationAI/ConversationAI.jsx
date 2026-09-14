import Image from 'next/image'
import styles from './ConversationAI.module.css'
import BlueButton from '@/components/BlueButton/BlueButton'

/**
 * Affiche une interface permettant à l'utilisateur de démarrer
 * une conversation avec l'assistant IA.
 *
 * Le composant présente une icône, un message indiquant les sujets
 * sur lesquels l'utilisateur peut poser ses questions, ainsi qu'un
 * bouton permettant de lancer la conversation.
 *
 * @returns {JSX.Element} Un bloc d'interface permettant de démarrer
 * une conversation avec l'assistant IA.
 */
export default function ConversationAI() {
    return (
        <div className={`${styles.conversationContainer} body-large`}>
            <div className={styles.conversation}>
                <Image
                    src="/IconeAI.svg"
                    alt="Icone AI"
                    width={19}
                    height={21}
                    priority
                />
                <p>Posez vos questions sur votre programme, vos performances ou vos objectifs.</p>
            </div>
            <BlueButton texte={"Lancer une conversation"} />
        </div>
    )
}