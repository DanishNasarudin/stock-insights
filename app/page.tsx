import Chart from "@/components/custom/Chart";
import { getSheetData } from "@/services/google-sheet";

export default async function Home() {
  const data = await getSheetData();

  // console.log("@First Query: ", processData);

  return (
    <main className="flex gap-4 p-4 w-full max-w-[800px] mx-auto">
      <Chart chartData={data.data?.values!} label={data.data?.label!} />
      <Chart chartData={data.data?.values!} label={data.data?.label!} />
    </main>
  );
}
