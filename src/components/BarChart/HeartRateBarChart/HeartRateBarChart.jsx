import { Bar, BarChart, CartesianGrid, Legend, Line, XAxis, YAxis } from "recharts";

/**
 * Éléments affichés dans la légende du graphique.
 *
 * Chaque élément définit le libellé à afficher ainsi que la couleur
 * associée à la donnée représentée dans le graphique.
 */
const LEGEND_ITEMS = [
    { value: 'min', color: 'var(--secondary-color-30)' },
    { value: 'max', color: 'var(--secondary-color-100)' },
    { value: 'average', color: 'var(--primary-color-100)' },
];

/**
 * Affiche la légende personnalisée du graphique de fréquence cardiaque.
 *
 * La légende est générée à partir des éléments définis dans `LEGEND_ITEMS`
 * et affiche pour chacun un indicateur coloré ainsi que son libellé.
 *
 * @returns {JSX.Element} Une liste contenant les différents éléments de la légende.
 */
function CustomLegend() {
    return (
        <ul
            style={{
                display: 'flex',
                gap: 16,
                listStyle: 'none',
                margin: 0,
                padding: 0,
            }}
        >
            {LEGEND_ITEMS.map(({ value, color }) => (
                <li key={value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: color,
                            display: 'inline-block',
                            flexShrink: 0,
                        }}
                    />
                    <span className="body-small">{value}</span>
                </li>
            ))}
        </ul>
    );
}

/**
 * Affiche un graphique combiné représentant les valeurs minimale,
 * maximale et moyenne de la fréquence cardiaque.
 *
 * Les valeurs minimale et maximale sont représentées sous forme de barres,
 * tandis que la valeur moyenne est représentée par une ligne.
 * L'axe horizontal et les données affichées sont configurables
 * grâce aux clés fournies en paramètres.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Array<Object>} props.data - Données utilisées pour alimenter le graphique.
 * @param {string} props.XDataKey - Nom de la propriété utilisée pour les valeurs
 * de l'axe horizontal.
 * @param {string[]} props.BarDataKey - Liste des propriétés utilisées pour les
 * données du graphique. L'index 0 correspond au minimum, l'index 1 au maximum
 * et l'index 2 à la moyenne.
 *
 * @returns {JSX.Element} Un graphique affichant les valeurs minimale,
 * maximale et moyenne de la fréquence cardiaque.
 */
export default function HeartRateGraph({ data, XDataKey, BarDataKey }) {

    const ticks = [130, 145, 160, 187]
    return (
        <BarChart
            style={{
                width: '100%',
                height: '100%',
            }}
            responsive
            data={data}
        >
            <CartesianGrid
                vertical={false}
                strokeWidth={1}
                strokeDasharray="2 2"
                stroke="#F1F1F1"
            />
            <XAxis
                dataKey={XDataKey}
                axisLine={true}
                tickLine={false}
                height={52}
                tick={{
                    fill: "var(--tertiary-color-60)",
                    fontSize: 10,
                }}
                tickMargin={25}
                tickClassName={"body-small"}
            />
            <YAxis
                width={16}
                axisLine={true}
                tickLine={false}
                ticks={ticks}
                tick={{
                    fill: "var(--tertiary-color-60)",
                    fontSize: 10,
                }}
            />
            <Legend verticalAlign="bottom" align="left" content={<CustomLegend />} />
            <Bar
                dataKey={BarDataKey[0]}
                name="min"
                fill="var(--secondary-color-30)"
                radius={30}
                barSize={14}
            />
            <Bar
                dataKey={BarDataKey[1]}
                name="max"
                fill="var(--secondary-color-100)"
                radius={30}
                barSize={14}
            />
            <Line
                type="monotone"
                dataKey={BarDataKey[2]}
                name="average"
                stroke="#F2F3FF"
                strokeWidth={3}
                dot={{
                    fill: 'var(--primary-color-100)',
                    r: 8,
                }}
            />
        </BarChart>
    );
}