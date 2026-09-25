import BlueButton from "@/components/BlueButton/BlueButton";
import styles from "./WeekRange.module.css";
import Calendar from "@/assets/calendar.svg";
import WeekRangePicker from "@/components/TrainingPlan/WeekRangePicker/WeekRangePicker";
import { useWatch } from "react-hook-form";
import ReturnButton from "@/components/ReturnButton/ReturnButton";

/**
 * Affiche l'étape de sélection de la période du programme d'entraînement.
 *
 * Le composant permet à l'utilisateur de choisir une date de début et une
 * date de fin à l'aide du sélecteur de période. Le bouton de navigation
 * vers l'étape suivante reste désactivé tant que les deux dates ne sont
 * pas sélectionnées.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.previousPage - Fonction permettant de revenir
 * à l'étape précédente.
 * @param {Function} props.nextPage - Fonction permettant de passer
 * à l'étape suivante.
 * @param {Object} props.control - Contrôle du formulaire fourni par React Hook Form.
 *
 * @returns {JSX.Element} L'interface de sélection de la période
 * avec les boutons de navigation.
 */
export default function WeekRange({ previousPage, nextPage, control }) {

  const weekRange = useWatch({
    control,
    name: "weekRange",
  });

  const isButtonDisabled =
    !weekRange?.start || !weekRange?.end;

  return (
    <div className={styles.trainingPlanContainer}>
      <Calendar
        width={66}
        height={66}
      />
      <h2 className="heading-3">
        Choisisser les semaines souhaitées pour réaliser votre programme ?
      </h2>
      <p className="body-default">
        Générer un programme sur la période de votre choix
      </p>
      <WeekRangePicker
        control={control}
      />
      <div className={styles.buttonContainer}>
        <ReturnButton onClick={previousPage} />
        <BlueButton
          texte="Suivant"
          onClick={nextPage}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}