import { Bar, BarChart, CartesianGrid, Legend, Line, XAxis, YAxis } from "recharts";

const LEGEND_ITEMS = [
    { value: 'min', color: 'var(--secondary-color-30)' },
    { value: 'max', color: 'var(--secondary-color-100)' },
    { value: 'average', color: 'var(--primary-color-100)' },
];

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

export default function HeartRateBarChart({ data, XDataKey, BarDataKey }) {

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