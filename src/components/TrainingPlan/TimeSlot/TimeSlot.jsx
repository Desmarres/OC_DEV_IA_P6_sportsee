import BlueButton from "@/components/BlueButton/BlueButton";
import styles from "./TimeSlot.module.css";
import TargetIcon from "@/assets/target.svg";
import { Controller, useWatch } from "react-hook-form";
import SelectableButton from "@/components/SelectableButton/SelectableButton";
import ReturnButton from "@/components/ReturnButton/ReturnButton";

export default function TimeSlot({ control, previousPage }) {

    const TIMESLOTS = Array.from({ length: 12 }, (_, i) => {
        const start = i * 2;
        const end = (start + 2) % 24;

        return `${String(start).padStart(2, "0")}h-${String(end).padStart(2, "0")}h`;
    });

    const timeSlot = useWatch({
        control,
        name: "timeSlot",
    });

    const isButtonDisabled = !timeSlot;

    return (
        <div className={styles.timeSlotContainer}>
            <TargetIcon
                width={66}
                height={66}
            />
            <h2 className="heading-3">
                Quel est votre créneau horaire d’entrainement ?
            </h2>
            <p className="body-default">
                Choisissez le créneau d’entrainement qui vous convient.
            </p>
            <Controller
                name="timeSlot"
                control={control}
                render={({ field }) => (
                    <div className={styles.selectContainer}>
                        {
                            TIMESLOTS.map((timeSlot, index) => (
                                <SelectableButton
                                    key={index}
                                    label={timeSlot}
                                    selected={field.value === timeSlot}
                                    onClick={() => field.onChange(timeSlot)}
                                />
                            ))
                        }
                    </div>
                )}
            />
            <div className={styles.buttonContainer}>
                <ReturnButton onClick={previousPage} />
                <BlueButton
                    texte="Générer mon planning"
                    type="submit"
                    disabled={isButtonDisabled}
                />
            </div>
        </div>
    );
}