import styles from "./LoaderPoint.module.css"

export default function LoaderPoint() {
    return (
        <div className={styles.chatLoader}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}