import styles from "./BlueButton.module.css"

/**
 * Affiche un bouton bleu avec un texte personnalisable.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.texte - Texte affiché à l'intérieur du bouton.
 * @param {string} props.type - Type du bouton.
 * @param {Function} props.onClick - Fonction exécutée au clic.
 * @param {boolean} props.disabled - Désactive le bouton.
 *
 * @returns {JSX.Element}
 */
export default function BlueButton({ texte, type = "button", onClick, disabled = false, }) {
    return (
        <button
            className={`${styles.button} body-large`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {texte}
        </button>
    )
}