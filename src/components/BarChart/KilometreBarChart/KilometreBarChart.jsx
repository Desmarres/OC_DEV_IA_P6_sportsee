import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

export default function KilometreBarChart({ data, XDataKey, YDataKey }) {

    const maxValue = Math.max(...data.map(item => item[YDataKey]));
    const maxTick = Math.ceil(maxValue / 10) * 10;

    const ticks = Array.from(
        { length: maxTick / 10 + 1 },
        (_, i) => i * 10
    );

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
            <Legend
                verticalAlign="bottom"
                align="left"
                iconType="circle"
                iconSize={8}
                formatter={() => "Km"}
            />
            <Bar
                dataKey={YDataKey}
                fill="var(--primary-color-30)"
                radius={30}
                barSize={14}
            />
        </BarChart>
    );
}