import styles from "./Loader.module.css";

/**
 * Affiche un indicateur de chargement animé.
 *
 * Chaque barre du loader se voit attribuer une couleur différente au
 * départ, dans l'ordre de sa position. Toutes les 500ms, chaque barre
 * passe à la couleur suivante jusqu'à atteindre la plus intense, puis
 * revient à la plus claire, donnant l'illusion d'une rotation.
 *
 * @returns {JSX.Element} Le loader SVG animé.
 */
export default function Loader() {
    return (
        <div className={styles.loaderContainer} >
            <svg
                className={styles.loader}
                viewBox="-58 -58 116 116"
                xmlns="http://www.w3.org/2000/svg"
                role="status"
                aria-label="Chargement en cours"
            >
                <g strokeLinecap="round" strokeWidth="15">
                    <path id="loader-bar" d="m0 35 0,14" />
                    <use className={styles.bar} transform="rotate(216)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(252)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(288)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(324)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(0)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(36)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(72)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(108)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(144)" href="#loader-bar" />
                    <use className={styles.bar} transform="rotate(180)" href="#loader-bar" />
                </g>
            </svg>
        </div>
    );
};
