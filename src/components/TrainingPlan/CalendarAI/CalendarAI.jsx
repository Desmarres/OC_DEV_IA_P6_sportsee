import BlueButton from "../../BlueButton/BlueButton";
import styles from "./CalendarAI.module.css";
import Calendar from "@/assets/calendar.svg";

export default function CalendarAI({ nextPage }) {
    return (
        <div className={styles.trainingPlanContainer}>
            <Calendar
                width={66}
                height={66}
            />
            <h2 className="heading-3">
                Créez votre planning d&apos;entraînement intelligent
            </h2>
            <p className="body-default">
                Notre IA vous aide à bâtir un planning 100 % personnalisé
                selon vos objectifs, votre niveau et votre emploi du temps.
            </p>
            <BlueButton
                texte="Commencer"
                onClick={nextPage}
            />
        </div>
    );
}