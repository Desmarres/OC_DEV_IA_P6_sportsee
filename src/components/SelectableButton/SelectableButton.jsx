import styles from "./SelectableButton.module.css";

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