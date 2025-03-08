import CommentContainter from "@/components/custom/CommentContainter";
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

  return (
    <CommentContainter
      form={{ tickerId: ticker.id }}
      comments={{ disableScroll: true, comments: ticker.comments }}
    />
  );
}
