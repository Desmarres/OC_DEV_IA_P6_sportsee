import BlueButton from "@/components/BlueButton/BlueButton";
import styles from "./TimeSlot.module.css";
import TargetIcon from "@/assets/target.svg";
import { Controller, useWatch } from "react-hook-form";
import SelectableButton from "@/components/SelectableButton/SelectableButton";
import ReturnButton from "@/components/ReturnButton/ReturnButton";

/**
 * Affiche l'étape de sélection du créneau horaire d'entraînement.
 *
 * Le composant génère une liste de créneaux de deux heures et permet
 * à l'utilisateur d'en sélectionner un. Le bouton de génération du planning
 * reste désactivé tant qu'aucun créneau n'est sélectionné.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.control - Contrôle du formulaire fourni par React Hook Form.
 * @param {Function} props.previousPage - Fonction permettant de revenir
 * à l'étape précédente.
 *
 * @returns {JSX.Element} L'interface de sélection du créneau horaire
 * avec les boutons de navigation.
 */
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