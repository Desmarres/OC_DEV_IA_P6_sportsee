import styles from "./ReturnButton.module.css";
import ReturnArrow from "@/assets/returnArrow.svg";

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