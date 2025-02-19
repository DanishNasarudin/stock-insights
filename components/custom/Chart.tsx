"use client";
import { TickerDataType } from "@/app/page";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, randomTailwindHexColor } from "@/lib/utils";
import { DividendDataType } from "@/services/google-sheet";
import { ExpandIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

export default function Chart({
  data = {} as TickerDataType,
}: {
  data: TickerDataType;
}) {
  // console.log(chartData.slice(-5), label, "CHECK");
  const { values, label, valueName, valueType } = data;
  const dividendTrend = getDividendTrend(values.slice(-11));

  const colorTrend =
    dividendTrend === "insufficient data"
      ? randomTailwindHexColor()
      : getColorTrend(dividendTrend);

  const chartConfig = {
    dividend: {
      label: `${valueName} (${valueType})`,
      color: colorTrend,
    },
  } satisfies ChartConfig;

  // console.log(randomTailwindHexColor(), "CHECK");
  if (values.length === 0) return <></>;
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4 justify-between",
        "p-4 border-border border-[1px] rounded-lg",
        ""
      )}
    >
      <div className="flex justify-between">
        <span className="text-lg">{label}</span>
        <Dialog aria-describedby="Details">
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <ExpandIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg">
            <DialogHeader>
              <DialogTitle>{label}</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <Separator />
            <ChartContainer
              config={chartConfig}
              className="min-h-[100px] w-full mt-4"
            >
              <BarChart accessibilityLayer data={values} margin={{ left: -24 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} axisLine={false} label={"%"} />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="dividend"
                  radius={4}
                  fill="var(--color-dividend)"
                />
              </BarChart>
            </ChartContainer>
          </DialogContent>
        </Dialog>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
        <BarChart accessibilityLayer data={values} margin={{ left: -24 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={true}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} label={"%"} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                className="backdrop-filter backdrop-blur-sm bg-background/60"
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="dividend" fill="var(--color-dividend)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

type Trend = "up" | "down" | "constant";

const getDividendTrend = (
  dividends: DividendDataType[]
): Trend | "insufficient data" => {
  const validDividends = dividends
    .map((d) => d.dividend)
    .filter((d): d is number => d !== null);

  if (validDividends.length < 2) return "insufficient data";

  const firstHalfAvg =
    validDividends
      .slice(0, Math.floor(validDividends.length / 2))
      .reduce((sum, val) => sum + val, 0) /
    (validDividends.length / 2);

  const secondHalfAvg =
    validDividends
      .slice(Math.floor(validDividends.length / 2))
      .reduce((sum, val) => sum + val, 0) /
    (validDividends.length / 2);

  if (secondHalfAvg > firstHalfAvg) return "up";
  if (secondHalfAvg < firstHalfAvg) return "down";
  return "constant";
};

const getColorTrend = (trend: Trend): string => {
  switch (trend) {
    case "up":
      return "#4ade80";
    case "down":
      return "#f87171";
    default:
      return randomTailwindHexColor();
  }
};

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

{
  /* <LineChart
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
    </LineChart>  */
}

{
  /* <AreaChart
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
    </AreaChart> */
}
