import { Controller, useWatch } from "react-hook-form";
import styles from "./AvailableDays.module.css";
import Calendar from "@/assets/calendar.svg";
import { DAYS } from "@/config/constants";
import SelectableButton from "@/components/SelectableButton/SelectableButton";
import BlueButton from "@/components/BlueButton/BlueButton";
import ReturnButton from "@/components/ReturnButton/ReturnButton";

export default function AvailableDays({ previousPage, nextPage, control }) {

    const availableDays = useWatch({
        control,
        name: "availableDays",
        defaultValue: [],
    });

    const isButtonDisabled = availableDays.length === 0;

    return (
        <div className={styles.availableContainer}>
            <Calendar
                width={66}
                height={66}
            />
            <h2 className="heading-3">
                Sur quel jour de la semaine souhaitez vous vous entrainer ?
            </h2>
            <p className="body-default">
                Choisissez les jours d’entrainements pour votre programme.
            </p>
            <Controller
                name="availableDays"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                    <div className={styles.selectContainer}>
                        {DAYS.map((day, index) => {
                            const selected = field.value.includes(index);

                            return (
                                <SelectableButton
                                    key={index}
                                    label={day}
                                    selected={selected}
                                    onClick={() => {
                                        if (selected) {
                                            field.onChange(
                                                field.value.filter(
                                                    (value) => value !== index
                                                )
                                            );
                                        } else {
                                            field.onChange([
                                                ...field.value,
                                                index,
                                            ]);
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
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