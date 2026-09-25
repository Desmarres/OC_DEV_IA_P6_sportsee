import useTraining from "@/context/TrainingContext";
import ClosedCross from "../ClosedCross/ClosedCross";
import WeekContainer from "../WeekContainer/WeekContainer";
import styles from "./TrainingModal.module.css";
import data from "@/assets/exemple.json"
import BlueButton from "@/components/BlueButton/BlueButton";

/**
 * Affiche la fenêtre modale présentant le planning d'entraînement généré.
 *
 * Le composant affiche les différentes semaines du programme ainsi que
 * les actions permettant de télécharger, régénérer ou créer un nouveau
 * programme. La modale peut être fermée à l'aide du bouton de fermeture.
 *
 * @returns {JSX.Element} La fenêtre modale contenant le planning
 * d'entraînement et ses actions.
 */
export default function TrainingModal() {

    const { answer } = data;
    const { toggleTraining } = useTraining();

    return (
        <div className={styles.trainingModalContainer}>
            <div className={styles.trainingModalContent}>
                <div className={styles.closedCrossContainer}>
                    <ClosedCross onClick={toggleTraining} />
                </div>
                <div className={styles.header}>
                    <h1 className="heading-3">Votre planning par semaine</h1>
                    <p className="body-default">
                        Important pour définir un programme adapté
                    </p>
                </div>

                <div className={styles.trainingMain}>
                    {answer.weeks.map((week, index) => (
                        <WeekContainer
                            key={index}
                            week={week}
                            isFirst={index === 0}
                        />
                    ))}
                </div>
                <div className={styles.trainingFooter} >
                    <BlueButton
                        texte="Télécharger"
                    />
                    <BlueButton
                        texte="Regénérer le programme"
                    />
                    <BlueButton
                        texte="Nouveau programme"
                    />
                </div>
            </div>
        </div>
    );
}