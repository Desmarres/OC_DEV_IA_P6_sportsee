import styles from "./ActivityTargetBarChart.module.css"
import { Pie, PieChart } from "recharts";

export default function ActivityTargetBarChart({ completed, goal = 6 }) {

    const remaining = Math.max(goal - completed, 0);
    const data = [
        {
            name: 'Réalisés',
            value: completed,
            fill: 'var(--primary-color-100)',
        },
        {
            name: 'Restants',
            value: remaining,
            fill: 'var(--primary-color-30)',
        },
    ];

    return (
        <div className={styles.pieChartContainer} >
            <PieChart
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: 1,
                }}
                responsive
            >
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="100%"
                    cornerRadius={2.45}
                    startAngle={-237.65}
                    endAngle={122.35}
                    stroke="transparente"
                />
            </PieChart>
            <div className={styles.realiseLabel}>
                <span className={styles.realisePoint} />
                <p className="body-small">
                    {data[0].value} {data[0].name}
                </p>
            </div>
            <div className={styles.restantLabel}>
                <span className={styles.restantPoint} />
                <p className="body-small">
                    {data[1].value} {data[1].name}
                </p>
            </div>
        </div>
    );
};
