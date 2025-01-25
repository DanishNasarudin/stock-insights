import Chart from "@/components/custom/Chart";
import Inputs from "@/components/custom/Inputs";
import Loading from "@/components/custom/Loading";
import Placeholder from "@/components/custom/Placeholder";
import { formatDateTime } from "@/lib/utils";
import { DividendDataType, getSheetData } from "@/services/google-sheet";
import { TriangleAlertIcon } from "lucide-react";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { search } = await searchParams;
  const { data, success, updatedAt } = await getSheetData();

  const searchTerm = Array.isArray(search) ? search[0] : search;

  // console.log("@First Query: ", data && data[1]);

  if (!success)
    return (
      <Placeholder
        icon={TriangleAlertIcon}
        iconClassName="stroke-red-500"
        title="Data Unavailable!"
        subtitle="Please try again later."
      />
    );

  const filterData = searchTerm
    ? data
      ? data.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : data
    : data;

  const groupedCharts = filterData
    ? filterData.reduce(
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
    <div className="flex flex-col gap-4 p-4 w-full md:max-w-[80vw] mx-auto h-full">
      <div className="py-4 space-y-2">
        <span className="text-lg font-bold">
          Malaysia's Stock Dividend Tracker
        </span>
        <Inputs />
        <p className="text-xs text-secondary-foreground/60">
          Data last updated: {formatDateTime(updatedAt!)}
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        {groupedCharts.length > 0 ? (
          groupedCharts.map((row, rowIndex) => (
            <div key={rowIndex} className="flex sm:flex-row flex-col gap-4">
              {row.map((item, chartIndex) => (
                <Chart
                  key={`${rowIndex}-${chartIndex}`}
                  chartData={item.values}
                  label={item.label!}
                />
              ))}
            </div>
          ))
        ) : (
          <Placeholder
            icon={TriangleAlertIcon}
            iconClassName="stroke-red-500"
            title="Stock does not exist OR not in database!"
            subtitle="Contact our support here: example@easydivmy.com"
          />
        )}
      </Suspense>
    </div>
  );
}
