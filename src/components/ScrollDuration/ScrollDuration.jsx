import styles from "./ScrollDuration.module.css"

export default function ScrollDuration({ title, color, firstDate, lastDate, description, onClick }) {
    return (
        <div >
            <div
                className={styles.headerScrollDuration}
                style={{ "--component-color": color }}
            >
                <p className={`${styles.averageChart} heading-4`}>{title}</p>
                <div className={styles.scrollDurationContainer}>
                    <button onClick={() => onClick(true)}>
                        <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.70709 0.5L0.707092 4.5L4.70709 8.5" stroke="#111111" strokeLinecap="round" />
                        </svg>
                    </button>
                    <p className="body-small">{firstDate} - {lastDate}</p>
                    <button onClick={() => onClick(false)}>
                        <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 8.5L4.5 4.5L0.5 0.5" stroke="#111111" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
            <p className={`${styles.descriptionChart} body-small`}>{description}</p>
        </div>

    )
}