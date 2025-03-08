import Comments from "@/components/custom/Comments";
import { getSheetData } from "@/services/google-sheet";
import { getTickerById } from "@/services/ticker";

export default async function Page({
  params,
}: {
  params: Promise<{ tickerId: number }>;
}) {
  const { tickerId } = await params;

  const ticker = await getTickerById(Number(tickerId));
  const { data, success } = await getSheetData(ticker?.ticker);

  if (!success || !data || !ticker) return null;

  return <Comments disableScroll comments={ticker.comments} />;
}
