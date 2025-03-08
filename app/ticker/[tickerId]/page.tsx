import { TickerDataType } from "@/app/(main)/page";
import Chart from "@/components/custom/Chart";
import Comments from "@/components/custom/Comments";
import { getSheetData } from "@/services/google-sheet";
import { getTickerById } from "@/services/ticker";

type Props = {
  params: Promise<{ tickerId: number }>;
};

export default async function TickerPage({ params }: Props) {
  const { tickerId } = await params;

  const ticker = await getTickerById(Number(tickerId));
  const { data, success } = await getSheetData(ticker?.ticker);

  // console.log(ticker, "CHECK");

  if (!success || !data || !ticker) return null;

  const tickerDetails: TickerDataType = {
    ...data[0],
    likes: ticker?.tickerLikes?.length || 0,
    dislikes: ticker?.tickerDislikes?.length || 0,
    shares: ticker?.shares || 0,
    comments: ticker?.comments?.length || 0,
    commentArray: ticker?.comments || [],
    createdAt: ticker?.createdAt?.toISOString() || "",
    updatedAt: ticker?.updatedAt?.toISOString() || "",
  };

  return (
    <main className="md:w-[60vw] h-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4">
      <Chart data={tickerDetails} />
      <Comments disableScroll comments={ticker.comments} />
    </main>
  );
}
