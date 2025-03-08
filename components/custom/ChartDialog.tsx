import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { TickerDataType } from "@/app/(main)/page";
import { ExpandIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "../ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Separator } from "../ui/separator";
import Comments from "./Comments";

type ChartDialogType = {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  data: TickerDataType;
  chartConfig: ChartConfig;
};

export default function ChartDialog({
  isOpen = false,
  setIsOpen,
  data = {} as TickerDataType,
  chartConfig = {},
}: ChartDialogType) {
  const {
    values,
    label,
    valueName,
    valueType,
    likes,
    dislikes,
    shares,
    comments,
    commentArray,
    createdAt,
  } = data;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="dividend" radius={4} fill="var(--color-dividend)" />
          </BarChart>
        </ChartContainer>
        <Separator />
        <Comments />
      </DialogContent>
    </Dialog>
  );
}
