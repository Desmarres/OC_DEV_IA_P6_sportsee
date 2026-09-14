import { GOAL_TARGET } from "@/config/constants";
import styles from "./ActivityTargetBarChart.module.css"
import { Pie, PieChart } from "recharts";

/**
 * Affiche un graphique circulaire représentant la progression
 * d'une activité par rapport à un objectif défini.
 *
 * Le graphique distingue le nombre d'activités réalisées
 * du nombre d'activités restantes pour atteindre l'objectif.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {number} props.completed - Nombre d'activités déjà réalisées.
 * @param {number} [props.goal=GOAL_TARGET] - Objectif total d'activités à atteindre.
 *
 * @returns {JSX.Element} Un graphique circulaire affichant la progression
 * et les valeurs réalisées/restantes.
 */
export default function ActivityTargetBarChart({ completed, goal = GOAL_TARGET }) {

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
