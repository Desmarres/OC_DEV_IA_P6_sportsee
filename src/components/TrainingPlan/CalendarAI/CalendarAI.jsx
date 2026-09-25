import BlueButton from "../../BlueButton/BlueButton";
import styles from "./CalendarAI.module.css";
import Calendar from "@/assets/calendar.svg";

/**
 * Affiche l'écran d'introduction à la création d'un planning d'entraînement
 * personnalisé avec l'aide de l'assistant IA.
 *
 * Présente une introduction au fonctionnement du planning et permet
 * à l'utilisateur de commencer le processus de création.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.nextPage - Fonction permettant de passer
 * à l'étape suivante du processus.
 *
 * @returns {JSX.Element} L'écran d'introduction à la création du planning.
 */
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