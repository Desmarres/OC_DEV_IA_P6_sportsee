import Image from 'next/image'
import styles from './ConversationAI.module.css'
import BlueButton from '@/components/BlueButton/BlueButton'

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