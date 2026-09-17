import LoaderPoint from "@/components/LoaderPoint/LoaderPoint";
import styles from "./ChatAnswer.module.css";
import IconAI from '@/assets/IconeAI.svg'

export default function ChatAnswer({ loading, answer }) {
    return (
        <div className={styles.chatAnswerContainer}>
            <div className={`${styles.imageContainer} ${styles.iconAI}`}>
                <IconAI
                    color="#FCC1B6"
                    width={20}
                    height={20}
                />
            </div>
            {loading ?
                <div className={styles.loaderContainer}><LoaderPoint /></div>
                :
                answer && (
                    <div className={styles.chatAnswerMain}>
                        <p className="body-small">Coach AI</p>
                        <div className={styles.chatAnswer}>
                            {answer}
                        </div>
                    </div>
                )
            }
        </div>
    );
}