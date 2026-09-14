import Image from 'next/image'
import styles from './GlobalDistance.module.css'

/**
 * Affiche la distance totale parcourue par l'utilisateur.
 *
 * La distance est présentée avec une icône de drapeau d'arrivée
 * et exprimée en kilomètres.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.totalDistance - Distance totale parcourue,
 * exprimée en kilomètres.
 *
 * @returns {JSX.Element} Un bloc affichant la distance totale parcourue.
 */
export default function GlobalDistance({ totalDistance }) {
    return (
        <div className={styles.globalDistance}>
            <p className="body-default">Distance totale parcourue</p>
            <div className={styles.blueBlock}>
                <Image
                    src="/finishFlag.svg"
                    alt="Icone outline"
                    width={34}
                    height={34}
                    priority
                />
                <p className="heading-4">{totalDistance} km</p>
            </div>
        </div>
    )
}