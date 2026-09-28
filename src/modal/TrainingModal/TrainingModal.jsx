import useTraining from "@/context/TrainingContext";
import ClosedCross from "../ClosedCross/ClosedCross";
import WeekContainer from "../WeekContainer/WeekContainer";
import styles from "./TrainingModal.module.css";
import BlueButton from "@/components/BlueButton/BlueButton";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useRouter } from "next/router";

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

    const { plan, loading, error, toggleTraining, regenerate, downloadPlan } = useTraining();

    const router = useRouter();

    const newPlan = () => {
        toggleTraining();
        router.push("/Dashboard?trainingPlanStep=target#trainingForm");
    }

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
                {loading ?
                    <Loader /> :
                    error ?
                        <ErrorMessage error={error} /> :
                        <div className={styles.trainingMain}>
                            {plan?.adjustmentNote && (
                                <>
                                    <p className="body-large"> L&apos;objectif a été modifié : {plan.target}.</p>
                                    <p className="body-small">{plan.adjustmentNote}</p>
                                </>
                            )}
                            {plan?.weeks?.map((week, index) => (
                                <WeekContainer
                                    key={week.weekNumber}
                                    week={week}
                                    isFirst={index === 0}
                                />
                            ))}
                        </div>
                }
                <div className={styles.trainingFooter} >
                    {!loading && !error && (
                        <BlueButton
                            texte="Télécharger"
                            onClick={() => downloadPlan()}
                        />
                    )}
                    <BlueButton
                        texte="Regénérer le programme"
                        onClick={regenerate}
                    />
                    <BlueButton
                        texte="Nouveau programme"
                        onClick={newPlan}
                    />
                </div>
            </div>
        </div>
    );
}