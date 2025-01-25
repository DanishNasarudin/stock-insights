"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  dividend: {
    label: "Dividend",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const Chart = ({ chartData }: { chartData: any[] }) => {
  if (chartData.length === 0) return <></>;
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={true}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="dividend" fill="var(--color-dividend)" radius={4} />
      </BarChart>
      {/* <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: -20,
          right: 12,
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="year" axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="dividend"
          type="natural"
          fill="var(--color-dividend)"
          fillOpacity={0.4}
          stroke="var(--color-dividend)"
          stackId="a"
        />
      </AreaChart> */}
      {/* <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="year" axisLine={false} tickMargin={8} />
        <YAxis axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="dividend"
          type="natural"
          stroke="var(--color-dividend)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-dividend)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart> */}
    </ChartContainer>
  );
};

export default Chart;
