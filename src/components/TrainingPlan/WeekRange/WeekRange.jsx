import BlueButton from "@/components/BlueButton/BlueButton";
import styles from "./WeekRange.module.css";
import Calendar from "@/assets/calendar.svg";
import WeekRangePicker from "@/components/TrainingPlan/WeekRangePicker/WeekRangePicker";
import { useWatch } from "react-hook-form";
import ReturnButton from "@/components/ReturnButton/ReturnButton";

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