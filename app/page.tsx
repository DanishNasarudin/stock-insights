import Chart from "@/components/custom/Chart";
import Placeholder from "@/components/custom/Placeholder";
import { DividendDataType, getSheetData } from "@/services/google-sheet";
import { TriangleAlertIcon } from "lucide-react";

export default async function Home() {
  const { data, success } = await getSheetData();

  console.log("@First Query: ", data && data[1]);

  if (!success)
    return (
      <Placeholder
        icon={TriangleAlertIcon}
        iconClassName="stroke-red-500"
        title="Data Unavailable!"
        subtitle="Please try again later."
      />
    );

  const groupedCharts = data
    ? data.reduce(
        (
          acc: { values: DividendDataType[]; label: string }[][],
          item,
          index
        ) => {
          if (index % 2 === 0) acc.push([]);
          acc[acc.length - 1].push(item);
          return acc;
        },
        []
      )
    : [];

  return (
    <main className="flex flex-col gap-4 p-4 w-full max-w-[800px] mx-auto">
      {groupedCharts.map((row, rowIndex) => (
        <div key={rowIndex} className="flex sm:flex-row flex-col gap-4">
          {row.map((item, chartIndex) => (
            <Chart
              key={`${rowIndex}-${chartIndex}`}
              chartData={item.values}
              label={item.label!}
            />
          ))}
        </div>
      ))}
    </main>
  );
}
