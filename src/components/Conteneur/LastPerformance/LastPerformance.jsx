import ChartDistance from '../ChartDistance/ChartDistance'
import ChartHeartRate from '../HeartRateGraph/HeartRateGraph'
import styles from './LastPerformance.module.css'

/**
 * Affiche les dernières performances de l'utilisateur
 * à travers différents graphiques.
 *
 * Le composant regroupe les graphiques de distance parcourue
 * et de fréquence cardiaque afin de présenter un aperçu
 * des performances récentes.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Date} [props.today=new Date()] - Date de référence transmise
 * aux graphiques pour déterminer les périodes affichées.
 *
 * @returns {JSX.Element} Une section regroupant les graphiques
 * des dernières performances.
 */
export default function LastPerformance({ today = new Date() }) {
    return (
        <div className={styles.lastPerformance}>
            <h2 className="heading-4">Vos dernières performances</h2>
            <div className={styles.chart}>
                <ChartDistance today={today} />
                <ChartHeartRate today={today} />
            </div>
        </div>
    )
}