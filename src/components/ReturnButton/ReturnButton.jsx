import styles from "./ReturnButton.module.css";
import ReturnArrow from "@/assets/returnArrow.svg";

/**
 * Affiche un bouton permettant de revenir à l'étape ou à la page précédente.
 *
 * Le clic sur le bouton déclenche la fonction fournie par le composant parent.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Function} props.onClick - Fonction appelée lors du clic sur le bouton.
 *
 * @returns {JSX.Element} Un bouton contenant une icône de retour.
 */
export default function ReturnButton({ onClick }) {
    return (
        <button className={styles.button} onClick={onClick}>
            <ReturnArrow
                width={16}
                height={11}
            />
        </button>
    );
}