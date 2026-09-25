import styles from "./SelectableButton.module.css";

/**
 * Affiche un bouton sélectionnable avec un style différent selon son état.
 *
 * Le bouton applique un style spécifique lorsqu'il est sélectionné
 * et déclenche une fonction lors du clic.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.label - Texte affiché dans le bouton.
 * @param {boolean} props.selected - Indique si le bouton est sélectionné.
 * @param {Function} props.onClick - Fonction appelée lors du clic sur le bouton.
 *
 * @returns {JSX.Element} Un bouton sélectionnable affichant le libellé fourni.
 */
export default function SelectableButton({ label, selected, onClick }) {
    return (
        <button
            type="button"
            className={`${styles.button} ${selected ? styles.selected : ""}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}