import styles from "./CustomMonthCaption.module.css";

export default function CustomMonthCaption({ calendarMonth }) {
    const month = calendarMonth.date;

    return (
        <div className={styles.monthCaption}>
            <span className="body-default">
                {month.toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                })}
            </span>
        </div>
    );
}