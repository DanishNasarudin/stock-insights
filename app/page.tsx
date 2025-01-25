import Chart from "@/components/custom/Chart";
import { getSheetData } from "@/services/google-sheet";

export default async function Home() {
  const data = await getSheetData();

  const processData =
    data.data &&
    data.data.slice(1).map(([year, dividend]) => {
      return {
        year: year as string,
        dividend: parseFloat(dividend as string),
      };
    });

  // console.log("@First Query: ", processData);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-[600px]">
        <Chart chartData={processData!} />
      </main>
    </div>
  );
}
