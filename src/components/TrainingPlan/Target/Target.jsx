import BlueButton from "@/components/BlueButton/BlueButton";
import styles from "./Target.module.css";
import TargetIcon from "@/assets/target.svg";
import { LISTE_TRAINING_OBJECTIF } from "@/config/constants";
import SelectableButton from "@/components/SelectableButton/SelectableButton";
import { Controller, useWatch } from "react-hook-form";
import ReturnButton from "@/components/ReturnButton/ReturnButton";

/**
 * Affiche l'étape de sélection de l'objectif principal d'entraînement.
 *
 * Le composant permet à l'utilisateur de sélectionner un objectif parmi
 * ceux définis dans la configuration. Le bouton de navigation vers l'étape
 * suivante reste désactivé tant qu'aucun objectif n'est sélectionné.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.previousPage - Fonction permettant de revenir
 * à l'étape précédente.
 * @param {Function} props.nextPage - Fonction permettant de passer
 * à l'étape suivante.
 * @param {Object} props.control - Contrôle du formulaire fourni par React Hook Form.
 *
 * @returns {JSX.Element} L'interface de sélection de l'objectif
 * avec les boutons de navigation.
 */
export default function Target({ previousPage, nextPage, control }) {

    const target = useWatch({
        control,
        name: "target",
    });

    const isButtonDisabled = !target;

    return (
        <div className={styles.targetContainer}>
            <TargetIcon
                width={66}
                height={66}
            />
            <h2 className="heading-3">
                Quel est votre objectif principal ?
            </h2>
            <p className="body-default">
                Choisissez l’objectif qui vous motive le plus
            </p>
            <Controller
                name="target"
                control={control}
                render={({ field }) => (
                    <div className={styles.selectContainer}>
                        {
                            LISTE_TRAINING_OBJECTIF.map((target, index) => (
                                <SelectableButton
                                    key={index}
                                    label={target}
                                    selected={field.value === target}
                                    onClick={() => field.onChange(target)}
                                />
                            ))
                        }
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