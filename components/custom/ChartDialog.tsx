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
import CommentContainter from "./CommentContainter";
import TooltipWrapper from "./TooltipWrapper";

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
    id,
  } = data;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipWrapper content="Expand">
        <DialogTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <ExpandIcon />
          </Button>
        </DialogTrigger>
      </TooltipWrapper>
      <DialogContent className="rounded-lg h-[100svh] md:max-h-[96svh] sm:h-auto overflow-hidden">
        <div className="w-full h-full space-y-4">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <Separator />
          <ChartContainer config={chartConfig} className="w-full mt-4">
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
              <Bar dataKey="dividend" radius={4} fill="var(--color-dividend)" />
            </BarChart>
          </ChartContainer>
          <Separator />
          <CommentContainter
            form={{ tickerId: id }}
            comments={{ comments: commentArray }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
