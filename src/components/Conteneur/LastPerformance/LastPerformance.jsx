import ChartDistance from '../ChartDistance/ChartDistance'
import ChartHeartRate from '../ChartHeartRate/ChartHeartRate'
import styles from './LastPerformance.module.css'

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