import Icon from '@/assets/IconeAI.svg'
import styles from './ConversationAI.module.css'
import BlueButton from '@/components/BlueButton/BlueButton'
import useChat from '@/context/ChatContext'

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

    const { toggleChat } = useChat();

    return (
        <div className={`${styles.conversationContainer} body-large`}>
            <div className={styles.conversation}>
                <Icon
                    color="var(--primary-color-100)"
                    width={19}
                    height={21}
                />
                <p>Posez vos questions sur votre programme, vos performances ou vos objectifs.</p>
            </div>
            <BlueButton
                texte="Lancer une conversation"
                onClick={toggleChat}
            />
        </div>
    )
}