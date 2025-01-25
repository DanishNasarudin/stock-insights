"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, randomTailwindHexColor } from "@/lib/utils";
import { ExpandIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const Chart = ({ chartData, label }: { chartData: any[]; label: string }) => {
  const chartConfig = {
    dividend: {
      label: "Dividend (%)",
      color: randomTailwindHexColor(),
    },
  } satisfies ChartConfig;

  // console.log(randomTailwindHexColor(), "CHECK");
  if (chartData.length === 0) return <></>;
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-4",
        "p-4 border-border border-[1px] rounded-lg",
        "max-w- max-h-min"
      )}
    >
      <div className="flex justify-between">
        <span className="text-lg">{label}</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <ExpandIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-md">
            <DialogHeader>
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>
            <Separator />
            <ChartContainer
              config={chartConfig}
              className="min-h-[100px] w-full mt-4"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ left: -24 }}
              >
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
                  fill={randomTailwindHexColor()}
                />
              </BarChart>
            </ChartContainer>
          </DialogContent>
        </Dialog>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
        <BarChart accessibilityLayer data={chartData} margin={{ left: -24 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={true}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} label={"%"} />
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
    </div>
  );
};

export default Chart;
