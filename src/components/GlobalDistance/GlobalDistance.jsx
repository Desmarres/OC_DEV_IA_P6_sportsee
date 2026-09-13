import Image from 'next/image'
import styles from './GlobalDistance.module.css'

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