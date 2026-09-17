import styles from "./ClosedCross.module.css";
import CrossClose from '@/assets/crossClose.svg'

export default function ClosedCross({ onClick }) {
    return (
        <div className={styles.closedContainer}>
            <div className="body-default" onClick={onClick}>
                <p>Fermer</p>
                <CrossClose
                    width={12}
                    height={12}
                />
            </div>
        </div>
    );
}