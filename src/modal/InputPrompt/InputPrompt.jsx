import BlueButton from "@/components/BlueButton/BlueButton";
import styles from "./InputPrompt.module.css";
import IconAI from '@/assets/IconeAI.svg'
import { useWatch } from "react-hook-form";
import { MAX_LENGTH_PROMPT } from "@/config/constants";

/**
 * Affiche le champ de saisie permettant à l'utilisateur d'envoyer
 * un message à l'assistant IA.
 *
 * Le composant gère l'affichage du placeholder, la saisie du prompt,
 * sa longueur maximale et l'envoi du formulaire avec la touche Entrée.
 * L'envoi est désactivé lorsqu'une réponse est en cours de traitement.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.control - Contrôle du formulaire fourni par React Hook Form.
 * @param {Function} props.register - Fonction d'enregistrement du champ
 * auprès de React Hook Form.
 * @param {boolean} props.loading - Indique si une requête est actuellement
 * en cours de traitement.
 *
 * @returns {JSX.Element} Le champ de saisie du prompt avec son bouton d'envoi.
 */
export default function InputPrompt({ control, register, loading }) {

    const promptWatch = useWatch({
        control,
        name: "prompt",
        defaultValue: "",
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            if (!loading) {
                e.currentTarget.form?.requestSubmit();
            }
        }
    };

    return (
        <div className={`${styles.textareaContainer} body-default`}>
            {!promptWatch && (
                <div className={styles.placeholder}>
                    <IconAI
                        color="var(--secondary-color-30)"
                        width={19}
                        height={21}
                    />
                    <span>Comment puis-je vous aider ?</span>
                </div>
            )}
            <textarea
                className={`${styles.textarea} body-default`}
                id="prompt"
                name="prompt"
                {...register("prompt")}
                onKeyDown={handleKeyDown}
                maxLength={MAX_LENGTH_PROMPT}
            />
            <BlueButton
                texte={
                    <svg
                        width="12"
                        height="16"
                        viewBox="0 0 12 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.862 5.80239C10.6649 5.99742 10.3449 5.99792 10.1479 5.80239L6.00993 1.70546V15.5C6.00993 15.776 5.7839 16 5.50486 16C5.22583 16 4.99979 15.776 4.99979 15.5V1.70546L0.861834 5.8019C0.66481 5.99742 0.344792 5.99742 0.147768 5.8019C-0.049256 5.60637 -0.049256 5.28984 0.147768 5.09481L5.14781 0.144774C5.34284 -0.0482597 5.66735 -0.0482597 5.86237 0.144774L10.8624 5.09481C11.0595 5.29034 11.0595 5.60687 10.862 5.80239C11.0595 5.60687 10.6649 5.99742 10.862 5.80239Z"
                            fill="white"
                        />
                    </svg>
                }
                type={loading ? "button" : "submit"}
            />
        </div>
    );
}